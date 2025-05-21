package com.rhythm_of_soul.content_service.service.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.content_service.dto.request.LikeCommentRequest;
import com.rhythm_of_soul.content_service.dto.request.NewContentEvent;
import com.rhythm_of_soul.content_service.service.RedisPublisher;
import com.rhythm_of_soul.content_service.utils.AESUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisPublisherImpl implements RedisPublisher {

  private final ObjectMapper objectMapper;

  private final SecretKey secretKey;
  private final RedisTemplate<String, String> redisTemplate;
  private String keyNewContent = "newcontent";
  private String keyLikeComment = "likecomment";

  @Async
  public void publishNewContentEvent(NewContentEvent event) {
    try {
      Map<String, Object> data = objectMapper.convertValue(event, Map.class);
      String json = objectMapper.writeValueAsString(data);
      String encryptedJson = AESUtil.encrypt(json, secretKey);
      Map<String, Object> redisData = Map.of("message", encryptedJson);

      redisTemplate
              .opsForStream()
              .add(StreamRecords.mapBacked(redisData).withStreamKey(keyNewContent));
      log.info("Publishing event: {}", event);
    } catch (Exception e) {
      log.error("Failed to push new content event to Redis", e);
    }
  }

  @Async
  public void publishLikeCommentEvent(LikeCommentRequest event) {
    try {
      Map<String, Object> data = objectMapper.convertValue(event, Map.class);
      String json = objectMapper.writeValueAsString(data);
      String encryptedJson = AESUtil.encrypt(json, secretKey);
      Map<String, Object> redisData = Map.of("message", encryptedJson);

      redisTemplate
              .opsForStream()
              .add(StreamRecords.mapBacked(redisData).withStreamKey(keyLikeComment));
    } catch (Exception e) {
      log.error("Failed to push like/comment event to Redis", e);
    }
  }
}
