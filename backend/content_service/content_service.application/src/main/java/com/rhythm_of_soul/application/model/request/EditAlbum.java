package com.rhythm_of_soul.application.model.request;

import com.rhythm_of_soul.domain.model.enums.Tag;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EditAlbum {
    String title;
    String coverUrl;
    String imageUrl;
    Boolean isPublic;
    List<String> songIds;
    List<Tag> tags;
    Instant scheduledAt;
    String caption;
}
