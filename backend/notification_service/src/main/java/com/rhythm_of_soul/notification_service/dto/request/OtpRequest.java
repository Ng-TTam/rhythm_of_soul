package com.rhythm_of_soul.notification_service.dto.request;

import lombok.Data;

@Data
public class OtpRequest {
  private String email;
  private String otp;
}
