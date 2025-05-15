
package com.rhythm_of_soul.notification_service.service.Impl;


import com.rhythm_of_soul.notification_service.constant.NotiType;
import com.rhythm_of_soul.notification_service.dto.request.*;
import com.rhythm_of_soul.notification_service.dto.response.NotificationResponse;
import com.rhythm_of_soul.notification_service.entity.Notification;
import com.rhythm_of_soul.notification_service.payload.NotificationPayload;
import com.rhythm_of_soul.notification_service.repository.NotificationRepository;
import com.rhythm_of_soul.notification_service.service.EmailService;
import com.rhythm_of_soul.notification_service.service.WebsocketService;
import com.rhythm_of_soul.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

  private final NotificationRepository notificationRepository;
  private final EmailService emailService;
  private final WebsocketService websocketService;

  @Override
  public void sendBanNotification(BanUserRequest request) {

    try {
      String content = """
                  <html>
                  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                      <h2 style="color: #d9534f;">Tài khoản của bạn đã bị khóa</h2>
                      <p>Xin chào,</p>
                      <p>Tài khoản của bạn đã bị <strong>cấm</strong> do vi phạm các điều khoản sử dụng.</p>
                      <p><strong>Lý do:</strong> %s</p>
                      <p>Nếu bạn nghĩ rằng đây là sự nhầm lẫn, vui lòng liên hệ với bộ phận hỗ trợ.</p>
                      <br>
                      <p>Trân trọng,</p>
                      <p><em>Rhythm of Soul</em></p>
                  </body>
                  </html>
              """.formatted(request.getReason());

      Notification notification = Notification.builder()
              .recipientId(request.getUserId())
              .senderId("ADMIN") // admin system
              .type(NotiType.BAN_USER)
              .referenceId(null)
              .referenceType("BAN")
              .message(content)
              .isRead(false)
              .createdAt(LocalDateTime.now())
              .build();

      notificationRepository.save(notification);
      log.info("noti saved");
      emailService.sendEmail(request.getEmail(), "BAN ACCOUNT", content);
    } catch (Exception e) {
      log.error("Failed to send email to {}: {}", request.getEmail(), e.getMessage());
    }
  }

  @Override
  public void handleNewContentEvent(NewContentEvent event) {

    try {
      String message = "%s vừa đăng nội dung mới".formatted(event.getAuthorName());

      NotiType type = switch (event.getContentType()) {
        case "POST" -> NotiType.NEW_POST;
        case "SONG" -> NotiType.NEW_SONG;
        default -> throw new IllegalArgumentException("Unknown content type: " + event.getContentType());
      };

      Notification notification = Notification.builder()
              .recipientId(event.getFollowerId())
              .senderId(event.getAuthorId())
              .type(type)
              .referenceId(event.getReferenceId())
              .referenceType(event.getContentType())
              .message(message)
              .isRead(false)
              .createdAt(LocalDateTime.now())
              .build();

      notificationRepository.save(notification);
      NotificationPayload payload = new NotificationPayload(
              notification.getId(),
              message,
              notification.getReferenceId(),
              notification.getCreatedAt()
      );

      websocketService.sendNotification(event.getFollowerId(), payload);

      log.info("Saved notification for followerId {}", event.getFollowerId());

    } catch (Exception e) {
      log.error("Failed: {}", e.getMessage());
    }
  }

  @Override
  public ResponseEntity<NotificationResponse> getNotificationList(String userId) {
    try {
      List<String> allowedTypes = List.of("NEW_POST", "NEW_SONG", "FOLLOW", "LIKE", "COMMENT");

      List<Notification> notifications = notificationRepository
              .findByRecipientIdAndIsReadFalseAndTypeIn(userId, allowedTypes);

      if (notifications.isEmpty()) {
        return new ResponseEntity<>(new NotificationResponse(0, List.of()), HttpStatus.OK);
      }

      long total = notifications.size();
      List<NotificationResponse.NotificationData> notificationDataList = notifications.stream()
              .map(notification -> new NotificationResponse.NotificationData(
                      notification.getId(),
                      notification.getMessage(),
                      notification.getReferenceId(),
                      notification.getCreatedAt()))
              .collect(Collectors.toList());

      NotificationResponse response = new NotificationResponse(total, notificationDataList);
      return new ResponseEntity<>(response, HttpStatus.OK);

    } catch (Exception e) {
      log.error("Failed to getNotificationList: {}", e.getMessage());
      return new ResponseEntity<>(new NotificationResponse(0, List.of()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Override
  public void markAllAsRead(String userId) {
    try {
      List<String> allowedTypes = List.of("NEW_POST", "NEW_SONG", "FOLLOW", "LIKE", "COMMENT");
      List<Notification> notifications = notificationRepository.findByRecipientIdAndIsReadFalseAndTypeIn(userId, allowedTypes);
      for (Notification notification : notifications) {
        notification.setRead(true);
      }
      notificationRepository.saveAll(notifications);
    } catch (Exception e) {
      log.error("Failed to mark notifications as read for user: {}", userId, e);
      throw e;
    }
  }

  @Override
  public ResponseEntity<NotificationResponse> getLatestNotifications(String userId, int x) {
    LocalDateTime fromDate = LocalDateTime.now().minusDays(x);

    // Lấy tất cả thông báo đã đọc trong vòng x ngày
    List<Notification> notifications = notificationRepository
            .findByRecipientIdAndIsReadTrueAndCreatedAtAfterOrderByCreatedAtDesc(userId, fromDate);

    if (notifications.isEmpty()) {
      return new ResponseEntity<>(new NotificationResponse(0, List.of()), HttpStatus.OK);
    }

    long total = notifications.size();
    List<NotificationResponse.NotificationData> notificationDataList = notifications.stream()
            .map(notification -> new NotificationResponse.NotificationData(
                    notification.getId(),
                    notification.getMessage(),
                    notification.getReferenceId(),
                    notification.getCreatedAt()
            ))
            .collect(Collectors.toList());

    NotificationResponse response = new NotificationResponse(total, notificationDataList);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }


  @Override
  public void handleFollowEvent(FollowRequest event) {

    try {
      String message = "%s vừa theo dõi bạn.".formatted(event.getFollowerName());

      Notification notification = Notification.builder()
              .recipientId(event.getFollowedId())
              .senderId(event.getFollowerId())
              .type(NotiType.FOLLOW)
              .referenceId("")
              .referenceType("FOLLOW")
              .message(message)
              .isRead(false)
              .createdAt(LocalDateTime.now())
              .build();

      notificationRepository.save(notification);
      NotificationPayload payload = new NotificationPayload(
              notification.getId(),
              message,
              notification.getReferenceId(),
              notification.getCreatedAt()
      );

      websocketService.sendNotification(event.getFollowedId(), payload);

      log.info("Saved notification {}", event.getFollowerId());

    } catch (Exception e) {
      log.error("Failed: {}", e.getMessage());
    }
  }

  @Override
  public void handleComment(LikeCommentRequest request) {
    try {

      // Tùy chọn: bỏ qua nếu người dùng tự cmt bài viết của mình
      if (request.getAuthorId().equals(request.getPostAuthorId())) {
        log.info("User comment their own post, no notification sent.");
        return;
      }
      String message = "%s đã bình luận về bài viết của bạn.".formatted(request.getAuthorName());

      Notification notification = Notification.builder()
              .recipientId(request.getPostAuthorId())   // Người nhận là chủ bài viết
              .senderId(request.getAuthorId())         // Người gửi là người bình luận
              .type(NotiType.COMMENT)
              .referenceId(request.getReferenceId())   // ID của bài viết hoặc comment
              .referenceType("COMMENT")
              .message(message)
              .isRead(false)
              .createdAt(LocalDateTime.now())
              .build();

      notificationRepository.save(notification);

      NotificationPayload payload = new NotificationPayload(
              notification.getId(),
              message,
              notification.getReferenceId(),
              notification.getCreatedAt()
      );

      websocketService.sendNotification(request.getPostAuthorId(), payload);

      log.info("Saved comment notification for post author {}", request.getPostAuthorId());

    } catch (Exception e) {
      log.error("Failed to send comment notification: {}", e.getMessage());
    }
  }

  @Override
  public void handleLike(LikeCommentRequest request) {
    try {
      // Tùy chọn: bỏ qua nếu người dùng tự like bài viết của mình
      if (request.getAuthorId().equals(request.getPostAuthorId())) {
        log.info("User liked their own post, no notification sent.");
        return;
      }

      String message = "%s đã thích bài viết của bạn.".formatted(request.getAuthorName());

      Notification notification = Notification.builder()
              .recipientId(request.getPostAuthorId())   // Người nhận là chủ bài viết
              .senderId(request.getAuthorId())         // Người gửi là người like
              .type(NotiType.LIKE)
              .referenceId(request.getReferenceId())   // ID bài viết
              .referenceType("LIKE")
              .message(message)
              .isRead(false)
              .createdAt(LocalDateTime.now())
              .build();

      notificationRepository.save(notification);

      NotificationPayload payload = new NotificationPayload(
              notification.getId(),
              message,
              notification.getReferenceId(),
              notification.getCreatedAt()
      );

      websocketService.sendNotification(request.getPostAuthorId(), payload);

      log.info("Saved like notification for post author {}", request.getPostAuthorId());

    } catch (Exception e) {
      log.error("Failed to send like notification: {}", e.getMessage());
    }
  }


}
