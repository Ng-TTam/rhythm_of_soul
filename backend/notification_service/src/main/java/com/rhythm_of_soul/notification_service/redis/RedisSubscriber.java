package com.rhythm_of_soul.notification_service.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.notification_service.dto.request.NewContentEvent;
import com.rhythm_of_soul.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class RedisSubscriber implements org.springframework.data.redis.connection.MessageListener {

    private final NotificationService notificationService;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String rawData = new String(message.getBody());
            log.info("Received Redis message: {}", rawData);

            ObjectMapper mapper = new ObjectMapper();
            NewContentEvent event = mapper.readValue(rawData, NewContentEvent.class);

            notificationService.handleNewContentEvent(event);
        } catch (Exception e) {
            log.error("Error processing Redis message: {}", e.getMessage());
        }
    }
}

