package com.rhythm_of_soul.notification_service.dto.response;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class NotificationResponse {
  private long total; // Tổng số notification chưa đọc
  private List<NotificationData> data; // Danh sách các notification

  @Data
  @AllArgsConstructor
  public static class NotificationData {
    private String id;
    private String message; // Nội dung thông báo
    private String referenceId; // link noti
  }
}
