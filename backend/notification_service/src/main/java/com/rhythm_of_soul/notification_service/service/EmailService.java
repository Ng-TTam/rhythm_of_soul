package com.rhythm_of_soul.notification_service.service;

public interface EmailService {
    void sendEmail(String to, String subject, String content);
}
