package com.rhythm_of_soul.infrastructure.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitmqConfig {
    public static final String CONTENT_EXCHANGE = "content.exchange";
    public static final String CONTENT_QUEUE = "content.queue";
    public static final String CONTENT_ROUTING_KEY = "content.created";

    @Bean
    public DirectExchange contentExchange() {
        return new DirectExchange(CONTENT_EXCHANGE);
    }

    @Bean
    public Queue contentQueue() {
        return QueueBuilder
                .durable(CONTENT_QUEUE)
                .build();
    }

    @Bean
    public Binding contentBinding(
            Queue contentQueue,
            DirectExchange contentExchange
    ) {
        return BindingBuilder
                .bind(contentQueue)
                .to(contentExchange)
                .with(CONTENT_ROUTING_KEY);
    }

    // Notification Queue Config
    public static final String NOTIFICATION_EXCHANGE = "notification.exchange";
    public static final String NOTIFICATION_QUEUE = "notification.queue";
    public static final String NOTIFICATION_ROUTING_KEY = "notification.created";

    @Bean
    public DirectExchange notificationExchange() {
        return new DirectExchange(NOTIFICATION_EXCHANGE);
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder
                .durable(NOTIFICATION_QUEUE)
                .build();
    }

    @Bean
    public Binding notificationBinding() {
        return BindingBuilder
                .bind(notificationQueue())
                .to(notificationExchange())
                .with(NOTIFICATION_ROUTING_KEY);
    }
}
