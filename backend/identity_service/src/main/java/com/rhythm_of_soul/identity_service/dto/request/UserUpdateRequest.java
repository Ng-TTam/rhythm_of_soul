package com.rhythm_of_soul.identity_service.dto.request;

import com.rhythm_of_soul.identity_service.constant.Gender;
import com.rhythm_of_soul.identity_service.entity.ArtistProfile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserUpdateRequest {
    @NotBlank(message = "BLANK_FIRST_NAME")
    String firstName;

    @NotBlank(message = "BLANK_LAST_NAME")
    String lastName;

    @NotNull(message = "BLANK_DOB")
    LocalDate dateOfBirth;

    @NotNull(message = "BLANK_GENDER")
    Gender gender;

    @NotBlank(message = "BLANK_PHONE_NUMBER")
    @Pattern(regexp = "^\\+?[0-9. ()-]{9,13}$", message = "INVALID_PHONE_NUMBER")
    String phoneNumber;

    String avatar;
    String cover;
    ArtistProfile artistProfile;
}
