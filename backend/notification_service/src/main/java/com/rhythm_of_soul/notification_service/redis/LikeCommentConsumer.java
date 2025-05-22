package com.rhythm_of_soul.notification_service.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.notification_service.dto.request.LikeCommentRequest;
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
public class LikeCommentConsumer {
  private final RedisTemplate<String, String> redisTemplate;
  private final NotificationService notificationService;
  private final ObjectMapper objectMapper;

  @Value("${redis.stream.likecomment.key}")
  private String streamKey;

  @Value("${redis.stream.likecomment.group}")
  private String consumerGroup;

  private final String consumerName = "likecomment-consumer";

  private SecretKey secretKey;

  @Value("${aes.secret-key}")
  private String base64SecretKey;

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
      log.warn("⚠️ Consumer group '{}' already exists for stream '{}'", consumerGroup, streamKey);
    }
  }

  @Scheduled(fixedDelay = 500)
  public void listenForMessages() {
    try {
      List<MapRecord<String, Object, Object>> messages = redisTemplate.opsForStream()
              .read(Consumer.from(consumerGroup, consumerName),
                      StreamReadOptions.empty().count(10).block(Duration.ofMillis(100)),
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

        // 🔥 Kiểm tra kiểu dữ liệu trước khi giải mã
        if (encryptedObject instanceof String encrypted) {
          log.info("🔑 Received encrypted message: {}", encrypted);

          // ✅ Giải mã trước khi xử lý
          String decrypted = AESUtil.decrypt(encrypted, secretKey);
          log.info("✅ Decrypted message: {}", decrypted);

          // ✅ Bây giờ dữ liệu là JSON, có thể parse được
          Map<String, Object> data = objectMapper.readValue(decrypted, new TypeReference<>() {});
          LikeCommentRequest request = objectMapper.convertValue(data, LikeCommentRequest.class);

          switch (request.getType()) {
            case LIKE -> notificationService.handleLike(request);
            case COMMENT -> notificationService.handleComment(request);
          }

          redisTemplate.opsForStream().acknowledge(streamKey, consumerGroup, message.getId());
          redisTemplate.opsForStream().delete(streamKey, message.getId());

          log.info("✅ Handle like-comment notification");
        } else {
          log.warn("⚠️ Unexpected data format: {}", encryptedObject);
        }
      } catch (Exception e) {
        log.error("🔥 Failed to process like-cmt message: {}", message, e);
      }
    }
  }


  private void handleProcessingError(Exception e) {
    log.error("❌ Error while processing Redis Stream Like-Cmt messages: ", e);
  }
}
