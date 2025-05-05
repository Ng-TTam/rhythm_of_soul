package com.rhythm_of_soul.identity_service.dto.request;

import com.rhythm_of_soul.identity_service.constant.ArtistProfileStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArtistProfileRequest {
    @NotBlank(message = "BLANK_STAGE_NAME")
    String stageName;
    String bio;
    String facebookUrl;
    String instagramUrl;
    String youtubeUrl;
}
