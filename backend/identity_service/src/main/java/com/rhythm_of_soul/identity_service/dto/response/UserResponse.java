package com.rhythm_of_soul.identity_service.dto.response;

import com.rhythm_of_soul.identity_service.constant.Role;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String email;
    String firstName;
    String lastName;
    boolean verify_email;
    Role role;
}
