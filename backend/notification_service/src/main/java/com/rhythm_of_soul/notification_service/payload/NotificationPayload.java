package com.rhythm_of_soul.notification_service.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationPayload {
  private String message;
  private String referenceId;
  private String notificationId;
}
