package com.rhythm_of_soul.notification_service.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.notification_service.dto.request.BanUserRequest;
import com.rhythm_of_soul.notification_service.dto.request.NewContentEvent;
import com.rhythm_of_soul.notification_service.service.NotificationService;
import com.rhythm_of_soul.notification_service.util.AESUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.data.redis.connection.stream.*;
import org.springframework.data.redis.core.RedisTemplate;
import jakarta.annotation.PostConstruct;
import com.fasterxml.jackson.core.type.TypeReference;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisStreamConsumer {

  private final RedisTemplate<String, Object> redisTemplate;
  private final NotificationService notificationService;
  private final ObjectMapper objectMapper;

  @Value("${redis.stream.key}")
  private String streamKey;

  @Value("${redis.stream.consumer.group}")
  private String consumerGroup;

  @Value("${redis.stream.consumer.name}")
  private String consumerName;

  @Value("${aes.secret-key}")
  private String base64SecretKey;

  private SecretKey secretKey;

  private void startListening() {
    Thread listenerThread = new Thread(() -> {
      while (true) {
        try {
          List<MapRecord<String, Object, Object>> messages = readMessages();
          if (messages != null && !messages.isEmpty()) {
            processMessages(messages);
          }
        } catch (Exception e) {
          handleProcessingError(e);
        }
      }
    });
    listenerThread.setDaemon(true);
    listenerThread.start();
  }



  @PostConstruct
  private void init() {
    secretKey = AESUtil.decodeKeyFromBase64(base64SecretKey);
    createConsumerGroupIfNotExist();
    startListening();
  }

  private void createConsumerGroupIfNotExist() {
    try {
      redisTemplate.opsForStream().createGroup(streamKey, consumerGroup);
      log.info("Consumer group '{}' created for stream '{}'", consumerGroup, streamKey);
    } catch (Exception e) {
      log.warn("Consumer group '{}' already exists for stream '{}'", consumerGroup, streamKey);
    }
  }

  private List<MapRecord<String, Object, Object>> readMessages() {
    return redisTemplate.opsForStream()
            .read(Consumer.from(consumerGroup, consumerName),
                    StreamReadOptions.empty().count(10).block(Duration.ofMinutes(2)),
                    StreamOffset.create(streamKey, ReadOffset.lastConsumed()));
  }

  private void processMessages(List<MapRecord<String, Object, Object>> messages) {
    for (MapRecord<String, Object, Object> message : messages) {
      try {
        String decryptedJson = AESUtil.decrypt((String) message.getValue().get("message"), secretKey);
        Map<String, Object> map = objectMapper.readValue(decryptedJson, new TypeReference<>() {});

        String contentType = (String) map.get("contentType");
        if ("BAN_USER".equalsIgnoreCase(contentType)) {
          BanUserRequest request = objectMapper.convertValue(map, BanUserRequest.class);
          notificationService.sendBanNotification(request);
        } else {
          NewContentEvent event = objectMapper.convertValue(map, NewContentEvent.class);
          notificationService.handleNewContentEvent(event);
        }

        redisTemplate.opsForStream().acknowledge(streamKey, consumerGroup, message.getId());
      } catch (Exception e) {
        log.warn("Failed to process message: {}", message, e);
      }
    }
  }

//  private NewContentEvent parseMessage(MapRecord<String, Object, Object> message) throws Exception {
//    Object rawEncrypted = message.getValue().get("message");
//    if (!(rawEncrypted instanceof String)) {
//      log.warn("Invalid message format: {}", message.getValue());
//      return null;
//    }
//
//    // Decrypt AES
//    String decryptedJson = AESUtil.decrypt((String) rawEncrypted, secretKey);
//
//    // Parse JSON to object
//    return objectMapper.readValue(decryptedJson, NewContentEvent.class);
//  }


  private void handleProcessingError(Exception e) {
    log.error("Error while processing Redis Stream messages: ", e);
    try {
      Thread.sleep(2000);
    } catch (InterruptedException ie) {
      Thread.currentThread().interrupt();
    }
  }

}
