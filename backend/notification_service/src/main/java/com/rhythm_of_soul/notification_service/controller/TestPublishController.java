package com.rhythm_of_soul.notification_service.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.notification_service.dto.request.BanUserRequest;
import com.rhythm_of_soul.notification_service.dto.request.NewContentEvent;
import com.rhythm_of_soul.notification_service.dto.request.OtpRequest;
import com.rhythm_of_soul.notification_service.util.AESUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestPublishController {

  private final RedisTemplate<String, Object> redisTemplate;
  private final ObjectMapper objectMapper;

  @Value("${redis.stream.newcontent.key}")
  private String streamKeyNewContent;

  @Value("${redis.stream.ban.key}")
  private String streamKeyBanUser;

  @Value("${redis.stream.otp.key}")
  private String streamKeyOtp;

  private final SecretKey secretKey;

  @PostMapping("/publish-test-event")
  public String publishTestEvent(@RequestBody NewContentEvent event) {
    try {
      // Add contentType để consumer nhận diện
      Map<String, Object> data = objectMapper.convertValue(event, Map.class);

      // Convert to JSON & Encrypt
      String json = objectMapper.writeValueAsString(data);
      String encryptedJson = AESUtil.encrypt(json, secretKey);

      // Push vào Redis Stream
      Map<String, Object> redisData = Map.of("message", encryptedJson);
      redisTemplate.opsForStream().add(
              StreamRecords.mapBacked(redisData).withStreamKey(streamKeyNewContent)
      );

      log.info("Published NEW_CONTENT event: {}", event);
      return "Published NEW_CONTENT event successfully!";
    } catch (Exception e) {
      log.error("Error publishing NEW_CONTENT event", e);
      return "Failed to publish NEW_CONTENT event: " + e.getMessage();
    }
  }

  @PostMapping("/publish-ban-user-event")
  public String publishBanUserEvent(@RequestBody BanUserRequest requestData) {
    try {
      // Add contentType để consumer nhận diện
      Map<String, Object> data = objectMapper.convertValue(requestData, Map.class);

      // Convert to JSON & Encrypt
      String json = objectMapper.writeValueAsString(data);
      String encryptedJson = AESUtil.encrypt(json, secretKey);

      // Push vào Redis Stream
      Map<String, Object> redisData = Map.of("message", encryptedJson);
      redisTemplate.opsForStream().add(
              StreamRecords.mapBacked(redisData).withStreamKey(streamKeyBanUser)
      );

      log.info("Published BAN_USER event: {}", requestData);
      return "Published BAN_USER event successfully!";
    } catch (Exception e) {
      log.error("Error publishing BAN_USER event", e);
      return "Failed to publish BAN_USER event: " + e.getMessage();
    }
  }

  @PostMapping("/publish-otp-event")
  public String publishOtpEvent(@RequestBody OtpRequest otpRequest) {
    try {
      // Add contentType
      Map<String, Object> data = objectMapper.convertValue(otpRequest, Map.class);
      // Convert to JSON & Encrypt
      String json = objectMapper.writeValueAsString(data);
      String encryptedJson = AESUtil.encrypt(json, secretKey);

      // Push to Redis Stream
      Map<String, Object> redisData = Map.of("message", encryptedJson);
      redisTemplate.opsForStream().add(
              StreamRecords.mapBacked(redisData).withStreamKey(streamKeyOtp)
      );

      log.info("Published OTP event: {}", otpRequest);
      return "Published OTP event successfully!";
    } catch (Exception e) {
      log.error("Error publishing OTP event", e);
      return "Failed to publish OTP event: " + e.getMessage();
    }
  }

}