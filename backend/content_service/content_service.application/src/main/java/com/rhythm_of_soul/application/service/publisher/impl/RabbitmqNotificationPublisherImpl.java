package com.rhythm_of_soul.application.service.publisher.impl;

import com.rhythm_of_soul.application.model.request.LikeCommentRequest;
import com.rhythm_of_soul.application.service.publisher.NotificationEventPublisher;
import com.rhythm_of_soul.infrastructure.config.RabbitmqConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RabbitmqNotificationPublisherImpl implements NotificationEventPublisher {
    
    private final RabbitTemplate rabbitTemplate;

    @Override
    public void publishNotificationEvent(LikeCommentRequest event) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitmqConfig.NOTIFICATION_EXCHANGE,
                    RabbitmqConfig.NOTIFICATION_ROUTING_KEY,
                    event
            );
            log.info("Successfully pushed notification event to RabbitMQ: {}", event);
        } catch (Exception e) {
            log.error("Failed to push notification event to RabbitMQ: {}", e.getMessage(), e);
        }
    }
}
