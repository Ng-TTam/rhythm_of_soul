package com.rhythm_of_soul.identity_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BanUserRequest {
    private String userId;
    private String email;
    private String reason;
    private String contentType;
}
