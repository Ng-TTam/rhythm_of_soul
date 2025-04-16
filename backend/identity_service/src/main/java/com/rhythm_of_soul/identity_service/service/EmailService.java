package com.rhythm_of_soul.identity_service.service;

public interface EmailService {
    boolean sendEmail(String email, String subject, String body);
}
