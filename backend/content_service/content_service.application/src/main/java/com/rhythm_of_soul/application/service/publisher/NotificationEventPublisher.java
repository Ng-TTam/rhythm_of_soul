package com.rhythm_of_soul.application.service.publisher;

import com.rhythm_of_soul.application.model.request.LikeCommentRequest;

public interface NotificationEventPublisher {
    void publishNotificationEvent(LikeCommentRequest event);
}
