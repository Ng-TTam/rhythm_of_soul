package com.rhythm_of_soul.application.model.response;

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
public class AlbumResponse {
    String id;
    String title;
    String imageUrl;
    String coverUrl;
    String accountId;
    int tracks;
    List<Tag> tags;
    Instant createdAt;
    Boolean isPublic;
    String caption;
    Instant updatedAt;
    Instant scheduledAt;
    int viewCount;
    int likeCount;
    int commentCount;
    Boolean isLiked;
}
