package com.rhythm_of_soul.notification_service.service.Impl;

import com.rhythm_of_soul.notification_service.service.EmailService;
import com.rhythm_of_soul.notification_service.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpServiceImpl implements OtpService {
  private final EmailService emailService;

  @Override
  public void sendResetPasswordOtp(String email, String otp) {
    String subject = "Mã OTP đặt lại mật khẩu";
    String content = """
                <html>
                <body>
                    <p>Xin chào,</p>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu. Mã OTP của bạn là:</p>
                    <h2>%s</h2>
                    <p>Mã này sẽ hết hạn sau 5 phút.</p>
                    <br>
                    <p>Rhythm of Soul</p>
                </body>
                </html>
                """.formatted(otp);

    try {
      emailService.sendEmail(email, subject, content);
      log.info("Đã gửi email reset password OTP đến {}", email);
    } catch (Exception e) {
      log.error("Lỗi khi gửi OTP đến {}: {}", email, e.getMessage());
      throw new RuntimeException("Không thể gửi email OTP.");
    }
  }


}
