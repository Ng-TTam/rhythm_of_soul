package com.rhythm_of_soul.identity_service.dto.response;

import java.time.Instant;
import java.time.LocalDate;

import com.rhythm_of_soul.identity_service.constant.Gender;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    //    Account account;
    String firstName;
    String lastName;
    LocalDate dateOfBirth;
    Gender gender;
    String phoneNumber;
    boolean isArtist;
    String avatar;
    String cover;
    ArtistProfileResponse artistProfile;
    Instant createdAt;
    Instant updatedAt;
}
