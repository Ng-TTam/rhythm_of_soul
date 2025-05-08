package com.rhythm_of_soul.identity_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetVerifyRequest {
  @Email
  @NotBlank
  String email;

  @NotBlank
  String otp;

  @NotBlank
  String newPassword;
}
