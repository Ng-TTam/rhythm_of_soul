package com.rhythm_of_soul.notification_service.redis;

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
import com.fasterxml.jackson.core.type.TypeReference;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class BanRedisStreamConsumer {

  private final RedisTemplate<String, Object> redisTemplate;
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
      log.error("Error in BanUserConsumer", e);
    }
  }

  private void process(MapRecord<String, Object, Object> message) {
    try {
      String decrypted = AESUtil.decrypt((String) message.getValue().get("message"), secretKey);
      Map<String, Object> data = objectMapper.readValue(decrypted, new TypeReference<>() {});
      String contentType = (String) data.get("contentType");

      if ("BAN_USER".equalsIgnoreCase(contentType)) {
        BanUserRequest request = objectMapper.convertValue(data, BanUserRequest.class);
        notificationService.sendBanNotification(request);
        redisTemplate.opsForStream().acknowledge(streamKey, consumerGroup, message.getId());
      }

    } catch (Exception e) {
      log.warn("Failed to process BAN_USER message", e);
    }
  }
}

