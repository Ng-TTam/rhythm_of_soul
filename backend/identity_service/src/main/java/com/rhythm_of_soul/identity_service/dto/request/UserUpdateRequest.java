package com.rhythm_of_soul.identity_service.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;

import com.rhythm_of_soul.identity_service.constant.Gender;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    @NotBlank(message = "BLANK_FIRST_NAME")
    String firstName;

    @NotBlank(message = "BLANK_LAST_NAME")
    String lastName;

    @NotNull(message = "BLANK_DOB")
    @Past(message = "INVALID_DOB")
    LocalDate dateOfBirth;

    @NotNull(message = "BLANK_GENDER")
    Gender gender;

    @NotBlank(message = "BLANK_PHONE_NUMBER")
    @Pattern(regexp = "^\\+?[0-9. ()-]{9,13}$", message = "INVALID_PHONE_NUMBER")
    String phoneNumber;

    String avatar;
    String cover;

    ArtistProfileRequest artistProfile;
}
