package com.rhythm_of_soul.notification_service.controller;

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
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
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

  @GetMapping("/latest/{userId}")
  public ResponseEntity<?> getLatestNoti(
          @PathVariable String userId,
          @RequestParam(name = "days", defaultValue = "7") int days
  ) {
    return notificationService.getLatestNotifications(userId, days);
  }


}
