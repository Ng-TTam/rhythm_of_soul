package com.rhythm_of_soul.notification_service.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationPayload {
  private String id;
  private String message; // Nội dung thông báo
  private String referenceId; // link noti
  private LocalDateTime createdAt;
}
