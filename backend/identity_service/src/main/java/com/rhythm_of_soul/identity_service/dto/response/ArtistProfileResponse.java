package com.rhythm_of_soul.identity_service.dto.response;

import java.time.Instant;

import com.rhythm_of_soul.identity_service.constant.ArtistProfileStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArtistProfileResponse {
    String id;
    String stageName;
    String bio;
    String facebookUrl;
    String instagramUrl;
    String youtubeUrl;
    ArtistProfileStatus status;
    Instant createdAt;
    Instant updatedAt;
}
