package com.rhythm_of_soul.notification_service.service;

import com.rhythm_of_soul.notification_service.payload.NotificationPayload;

public interface WebsocketService {
    void sendNotification(String userId, NotificationPayload payload);
}
