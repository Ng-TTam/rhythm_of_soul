package com.rhythm_of_soul.notification_service.service.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.notification_service.payload.NotificationPayload;
import com.rhythm_of_soul.notification_service.service.WebsocketService;
import com.rhythm_of_soul.notification_service.util.AESUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;


@Service
@RequiredArgsConstructor
@Slf4j
public class WebsocketServiceImpl implements WebsocketService {

    private final SimpMessagingTemplate messagingTemplate;

    private final SecretKey secretKey;
    private final ObjectMapper objectMapper;


    @Override
    public void sendNotification(String userId, NotificationPayload payload) {

        try {
            String destination = "/notifications/" + userId;

            // Serialize payload to JSON
            String json = objectMapper.writeValueAsString(payload);

            // Encrypt JSON
            String encryptedJson = AESUtil.encrypt(json, secretKey);

            // Send encrypted data via WebSocket
            messagingTemplate.convertAndSend(destination, encryptedJson);

            log.info("Encrypted WebSocket notification sent to {}: {}", userId, encryptedJson);
        } catch (Exception e) {
            log.error("Failed to send encrypted WebSocket notification", e);
        }
    }

}
