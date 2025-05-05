package com.rhythm_of_soul.notification_service.dto.request;

import lombok.Data;


@Data
public class BanUserRequest {
    private String userId;
    private String email;
    private String reason;
    private String contentType;
}
