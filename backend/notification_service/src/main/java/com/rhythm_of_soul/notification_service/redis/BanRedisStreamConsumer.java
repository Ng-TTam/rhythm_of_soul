package com.rhythm_of_soul.notification_service.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.notification_service.dto.request.BanUserRequest;
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
public class BanRedisStreamConsumer {

  private final RedisTemplate<String, String> redisTemplate;
  private final NotificationService notificationService;
  private final ObjectMapper objectMapper;

  @Value("${redis.stream.ban.key}")
  private String streamKey;

  @Value("${redis.stream.ban.group}")
  private String consumerGroup;

  @Value("${aes.secret-key}")
  private String base64SecretKey;

  private SecretKey secretKey;
  private final String consumerName = "ban-user-consumer";

  @PostConstruct
  public void init() {
    secretKey = AESUtil.decodeKeyFromBase64(base64SecretKey);
    createConsumerGroupIfNotExist();
  }

  private void createConsumerGroupIfNotExist() {
    try {
      redisTemplate.opsForStream().createGroup(streamKey, consumerGroup);
      log.info("✅ Consumer group '{}' created for stream '{}'", consumerGroup, streamKey);
    } catch (Exception e) {
      log.warn("⚠️ Consumer group '{}' already exists", consumerGroup);
    }
  }

  @Scheduled(fixedDelay = 5000)
  public void listenForMessages() {
    try {
      List<MapRecord<String, Object, Object>> messages = redisTemplate.opsForStream()
              .read(Consumer.from(consumerGroup, consumerName),
                      StreamReadOptions.empty().count(10).block(Duration.ofMillis(1000)),
                      StreamOffset.create(streamKey, ReadOffset.lastConsumed()));
      if (messages != null && !messages.isEmpty()) {
        processMessages(messages);
      }
    } catch (Exception e) {
      handleProcessingError(e);
    }
  }

  private void processMessages(List<MapRecord<String, Object, Object>> messages) {
    for (MapRecord<String, Object, Object> message : messages) {
      try {
        Object encryptedObject = message.getValue().get("message");

        if (encryptedObject instanceof String encrypted){
          log.info("🔑 Received encrypted message: {}", encrypted);

          String decrypted = AESUtil.decrypt(encrypted, secretKey);
          log.info("✅ Decrypted message: {}", decrypted);

          Map<String, Object> data = objectMapper.readValue(decrypted, new TypeReference<>() {});
          String contentType = (String) data.get("contentType");

          if ("BAN_USER".equalsIgnoreCase(contentType)) {
            BanUserRequest request = objectMapper.convertValue(data, BanUserRequest.class);
            notificationService.sendBanNotification(request);
            redisTemplate.opsForStream().acknowledge(streamKey, consumerGroup, message.getId());
            redisTemplate.opsForStream().delete(streamKey, message.getId());

            log.info("✅ Processed BanUserRequest for {}", request.getUserId());
          }
        }
      } catch (Exception e) {
        log.warn("🔥 Failed to process BAN_USER message: {}", message, e);
      }
    }
  }

  private void handleProcessingError(Exception e) {
    log.error("❌ Error while processing BanUser Redis Stream messages: ", e);
  }
}
