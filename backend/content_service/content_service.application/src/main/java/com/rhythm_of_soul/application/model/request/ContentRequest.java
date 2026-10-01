package com.rhythm_of_soul.application.model.request;

import com.rhythm_of_soul.domain.model.enums.Tag;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContentRequest {
    @NotBlank
    String title;
    String mediaUrl;
    String imageUrl;
    String coverUrl;
    String originalPostId;
    List<Tag> tags;
    List<String> songIds;
}
