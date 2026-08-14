package com.rhythm_of_soul.application.service.publisher;

import com.rhythm_of_soul.application.model.request.NewContentEvent;
import com.rhythm_of_soul.infrastructure.config.RabbitmqConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ContentEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishContentCreated(NewContentEvent event){
        rabbitTemplate.convertAndSend(
                RabbitmqConfig.CONTENT_EXCHANGE,
                RabbitmqConfig.CONTENT_ROUTING_KEY,
                event
        );
    }

}
