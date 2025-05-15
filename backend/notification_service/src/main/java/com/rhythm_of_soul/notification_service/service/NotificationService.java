
package com.rhythm_of_soul.notification_service.service;

import com.rhythm_of_soul.notification_service.dto.request.*;
import com.rhythm_of_soul.notification_service.dto.response.NotificationResponse;
import org.springframework.http.ResponseEntity;


public interface NotificationService {
  void sendBanNotification(BanUserRequest request);
  void handleNewContentEvent(NewContentEvent event);
  ResponseEntity<NotificationResponse> getNotificationList(String userId);
  void markAllAsRead(String userId);
  ResponseEntity<NotificationResponse> getLatestNotifications(String userId, int x);
  void handleFollowEvent(FollowRequest event);
  void handleComment(LikeCommentRequest request);
  void handleLike(LikeCommentRequest request);


}
