package com.rhythm_of_soul.content_service.dto.request;

import com.rhythm_of_soul.content_service.common.Tag;
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
public class EditPlaylist {
    String title;
    String coverUrl;
    String imageUrl;
    Boolean isPublic;
    List<String> songIds;
    List<Tag> tags;
    String caption;
}
