package com.rhythm_of_soul.identity_service.dto.response;

import com.rhythm_of_soul.identity_service.constant.ArtistProfileStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

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
    ArtistProfileStatus status = ArtistProfileStatus.PENDING;
    Instant createdAt;
    Instant updatedAt;
}
