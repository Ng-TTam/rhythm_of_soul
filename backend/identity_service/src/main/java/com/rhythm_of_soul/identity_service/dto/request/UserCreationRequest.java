package com.rhythm_of_soul.identity_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @NotBlank(message = "BLANK_FIRST_NAME")
    String firstName;

    @NotBlank(message = "BLANK_LAST_NAME")
    String lastName;

    @Email
    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@gmail\\.com$", message = "EMAIL_MUST_BE_GMAIL")
    String email;

    @NotBlank(message = "BLANK_PHONE_NUMBER")
    @Pattern(regexp = "^\\+?[0-9. ()-]{9,13}$", message = "INVALID_PHONE_NUMBER")
    String phoneNumber;

    @NotBlank(message = "BLANK_PASSWORD")
    @Size(min = 8, max = 64, message = "INVALID_PASSWORD")
    String password;
}
