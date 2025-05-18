package com.rhythm_of_soul.identity_service.dto.response;

import java.time.Instant;

import com.rhythm_of_soul.identity_service.constant.Role;
import com.rhythm_of_soul.identity_service.constant.Status;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountResponse {
    String id;
    String email;
    boolean isVerified;
    String avatar;
    Role role;
    Status status;
    Instant createdAt;
    Instant updatedAt;
    String fullName;
}
