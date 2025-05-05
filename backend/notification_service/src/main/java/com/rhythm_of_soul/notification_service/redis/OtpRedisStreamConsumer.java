package com.rhythm_of_soul.notification_service.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.notification_service.dto.request.NewContentEvent;
import com.rhythm_of_soul.notification_service.dto.request.OtpRequest;
import com.rhythm_of_soul.notification_service.service.NotificationService;
import com.rhythm_of_soul.notification_service.service.OtpService;
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
public class OtpRedisStreamConsumer {

  private final RedisTemplate<String, Object> redisTemplate;
  private final OtpService otpService;
  private final ObjectMapper objectMapper;

  @Value("${redis.stream.otp.key}")
  private String streamKey;

  @Value("${redis.stream.otp.group}")
  private String consumerGroup;

  private final String consumerName = "otp-consumer";

  @Value("${aes.secret-key}")
  private String base64SecretKey;

  private SecretKey secretKey;

  @PostConstruct
  public void init() {
    secretKey = AESUtil.decodeKeyFromBase64(base64SecretKey);
    createConsumerGroupIfNotExist();
  }

  private void createConsumerGroupIfNotExist() {
    try {
      redisTemplate.opsForStream().createGroup(streamKey, consumerGroup);
      log.info("Consumer group '{}' created for stream '{}'", consumerGroup, streamKey);
    } catch (Exception e) {
      log.warn("Consumer group '{}' already exists for stream '{}'", consumerGroup, streamKey);
    }
  }

  @Scheduled(fixedDelay = 5000)
  public void listenForMessages() {
    try {
      List<MapRecord<String, Object, Object>> messages = redisTemplate.opsForStream()
              .read(Consumer.from(consumerGroup, consumerName),
                      StreamReadOptions.empty().count(10).block(Duration.ofSeconds(5)),
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
        String decrypted = AESUtil.decrypt((String) message.getValue().get("message"), secretKey);
        Map<String, Object> data = objectMapper.readValue(decrypted, new TypeReference<>() {});

        OtpRequest otp = objectMapper.convertValue(data, OtpRequest.class);
        otpService.sendResetPasswordOtp(otp.getEmail(), otp.getOtp());
        redisTemplate.opsForStream().acknowledge(streamKey, consumerGroup, message.getId());
      } catch (Exception e) {
        log.warn("Failed to process OTP message: {}", message, e);
      }
    }
  }

  private void handleProcessingError(Exception e) {
    log.error("Error while processing Redis Stream OTP messages: ", e);
  }
}


