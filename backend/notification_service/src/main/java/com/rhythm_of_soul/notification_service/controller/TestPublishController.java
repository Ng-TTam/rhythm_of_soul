package com.rhythm_of_soul.notification_service.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.notification_service.dto.request.BanUserRequest;
import com.rhythm_of_soul.notification_service.dto.request.NewContentEvent;
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

  @Value("${redis.stream.key}")
  private String streamKey;

  private final SecretKey secretKey;


  @PostMapping("/publish-test-event")
  public String publishTestEvent(@RequestBody NewContentEvent event) {
    try {
      // Convert event -> JSON
      String json = objectMapper.writeValueAsString(event);

      // Encrypt JSON
      String encryptedJson = AESUtil.encrypt(json, secretKey);

      // Push vào Redis Stream
      Map<String, Object> map = Map.of("message", encryptedJson);
      for(int i=0; i<5;i++) {
        redisTemplate.opsForStream().add(
                StreamRecords.mapBacked(map).withStreamKey(streamKey)
        );
      }

      log.info("Published test event: {}", event);
      return "Test event published successfully!";
    } catch (Exception e) {
      log.error("Error publishing test event", e);
      return "Failed to publish test event: " + e.getMessage();
    }
  }

  @PostMapping("/publish-ban-user-event")
  public String publishBanUserEvent(@RequestBody BanUserRequest requestData) {
    try {

      // Chuyển thành JSON
      String json = objectMapper.writeValueAsString(requestData);

      // Encrypt JSON
      String encryptedJson = AESUtil.encrypt(json, secretKey);

      // Push vào Redis Stream
      Map<String, Object> map = Map.of("message", encryptedJson);
      for (int i = 0; i < 2; i++) {
        redisTemplate.opsForStream().add(
                StreamRecords.mapBacked(map).withStreamKey(streamKey)
        );
      }

      log.info("Published test BAN_USER event: {}", requestData);
      return "Test BAN_USER event published successfully!";
    } catch (Exception e) {
      log.error("Error publishing BAN_USER event", e);
      return "Failed to publish BAN_USER event: " + e.getMessage();
    }
  }

}