package com.rhythm_of_soul.identity_service.service.impl;

import com.rhythm_of_soul.identity_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    @Override
    public boolean sendEmail(String email, String subject, String body) {
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}: {}", email, subject);
            return true;
        }catch (Exception e){
            log.error("Failed to send email to {}: {}", email, e.getMessage());
            return false;
        }
    }
}
