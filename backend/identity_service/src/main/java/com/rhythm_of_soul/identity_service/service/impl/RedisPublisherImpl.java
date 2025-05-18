package com.rhythm_of_soul.identity_service.service.impl;

import java.util.Map;
import javax.crypto.SecretKey;

import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.identity_service.constant.SecurityConstants;
import com.rhythm_of_soul.identity_service.dto.request.FollowRequest;
import com.rhythm_of_soul.identity_service.service.RedisPublisher;
import com.rhythm_of_soul.identity_service.utils.AESUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisPublisherImpl implements RedisPublisher {
    private final ObjectMapper objectMapper;

    private final SecretKey secretKey;
    private final RedisTemplate<String, String> redisTemplate;

    @Async
    public void publishFollowEvent(FollowRequest request) {
        try {
            Map<String, Object> data = objectMapper.convertValue(request, Map.class);
            String json = objectMapper.writeValueAsString(data);
            String encryptedJson = AESUtil.encrypt(json, secretKey);
            Map<String, Object> redisData = Map.of("message", encryptedJson);

            redisTemplate
                    .opsForStream()
                    .add(StreamRecords.mapBacked(redisData).withStreamKey(SecurityConstants.STREAM_FOLLOW_KEY));
        } catch (Exception e) {
            log.error("Failed to push follow event to Redis", e);
        }
    }
}
