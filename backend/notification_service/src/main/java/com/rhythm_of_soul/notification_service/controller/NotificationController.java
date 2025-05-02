package com.rhythm_of_soul.notification_service.controller;


import com.rhythm_of_soul.notification_service.dto.request.OtpRequest;
import com.rhythm_of_soul.notification_service.dto.response.NotificationResponse;
import com.rhythm_of_soul.notification_service.service.NotificationService;
import com.rhythm_of_soul.notification_service.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
@RequestMapping("/notification")
public class NotificationController {

  private final NotificationService notificationService;
  private final OtpService otpService;

  @GetMapping("/listNoti")
  public ResponseEntity<?> getListNotification(@RequestParam String userId) {
    if (userId == null || userId.isEmpty()) {
      return ResponseEntity.badRequest().body("User ID is required");
    }

    try {
      return notificationService.getNotificationList(userId);
    } catch (DataAccessException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("Database error: " + e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("Unexpected error: " + e.getMessage());
    }
  }

  @PutMapping("/mark-all-read/{userId}")
  public ResponseEntity<?> markAllNotificationsAsRead(@PathVariable String userId) {
    try {
      log.info("Marking all notifications as read for user: {}", userId);
      notificationService.markAllAsRead(userId);
      return ResponseEntity.ok("All notifications marked as read");
    } catch (Exception e) {
      log.error("Error marking notifications as read", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("Error: " + e.getMessage());
    }
  }

  @GetMapping("/top5/{userId}")
  public ResponseEntity<?> getTop5Noti(@PathVariable String userId) {
    return notificationService.getTop5LatestNotifications(userId);
  }

  @PostMapping("/auth/send-reset-otp")
  public ResponseEntity<?> sendResetOtp(@RequestBody OtpRequest request) {
    otpService.sendResetPasswordOtp(request.getEmail(), request.getOtp());
    return ResponseEntity.ok("OTP sent successfully");
  }


}
