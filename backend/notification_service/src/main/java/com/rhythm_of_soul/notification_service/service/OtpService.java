package com.rhythm_of_soul.notification_service.service;

public interface OtpService {
  void sendResetPasswordOtp(String email, String otp);
}
