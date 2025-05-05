package com.rhythm_of_soul.notification_service.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.notification_service.dto.request.NewContentEvent;
import com.rhythm_of_soul.notification_service.service.NotificationService;
import com.rhythm_of_soul.notification_service.util.AESUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.stream.*;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class NewContentRedisStreamConsumer {

  private final RedisTemplate<String, Object> redisTemplate;
  private final NotificationService notificationService;
  private final ObjectMapper objectMapper;

  @Value("${redis.stream.newcontent.key}")
  private String streamKey;

  @Value("${redis.stream.newcontent.group}")
  private String consumerGroup;

  @Value("${aes.secret-key}")
  private String base64SecretKey;

  private SecretKey secretKey;

  private final String consumerName = "new-content-consumer";

  @PostConstruct
  public void init() {
    secretKey = AESUtil.decodeKeyFromBase64(base64SecretKey);
    createConsumerGroupIfNotExist();
  }

  private void createConsumerGroupIfNotExist() {
    try {
      redisTemplate.opsForStream().createGroup(streamKey, consumerGroup);
    } catch (Exception e) {
      log.info("Consumer group '{}' already exists", consumerGroup);
    }
  }

  @Scheduled(fixedDelay = 5000)
  public void listenForMessages() {
    try {
      List<MapRecord<String, Object, Object>> data = redisTemplate.opsForStream()
              .read(Consumer.from(consumerGroup, consumerName),
                      StreamReadOptions.empty().count(10).block(Duration.ofSeconds(5)),
                      StreamOffset.create(streamKey, ReadOffset.lastConsumed()));

      if (data != null) {
        for (MapRecord<String, Object, Object> msg : data) {
          process(msg);
        }
      }
    } catch (Exception e) {
      log.error("Error in NewContentConsumer", e);
    }
  }

  private void process(MapRecord<String, Object, Object> message) {
    try {
      String decrypted = AESUtil.decrypt((String) message.getValue().get("message"), secretKey);
      log.info("Decrypted JSON: {}", decrypted);
      Map<String, Object> data = objectMapper.readValue(decrypted, new TypeReference<>() {});
      NewContentEvent event = objectMapper.convertValue(data, NewContentEvent.class);
      notificationService.handleNewContentEvent(event);
      redisTemplate.opsForStream().acknowledge(streamKey, consumerGroup, message.getId());

    } catch (Exception e) {
      log.warn("Failed to process NEW_CONTENT message", e);
    }
  }
}

