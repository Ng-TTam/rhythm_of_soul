package com.rhythm_of_soul.notification_service.service.Impl;

import com.rhythm_of_soul.notification_service.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
  private final JavaMailSender mailSender;

  @Value("${spring.mail.username}")
  private String mailFrom;

  @Override
  public void sendEmail(String to, String subject, String content) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(content, true);
      helper.setFrom(mailFrom);

      mailSender.send(message);
      log.info("Email sent to {}", to);
    } catch (Exception e) {
      log.error("Failed to send email: {}", e.getMessage());
    }
  }

}
