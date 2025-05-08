package com.rhythm_of_soul.identity_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    @Email(message = "EMAIL_MUST_BE_GMAIL")
    @NotBlank(message = "BLANK_EMAIL")
    String email;

    @NotBlank(message = "BLANK_PASSWORD")
    @Size(min = 8, max = 64, message = "INVALID_PASSWORD")
    String password;

    Boolean remember;
}
