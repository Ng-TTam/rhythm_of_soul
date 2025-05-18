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

public class AlbumCreationRequest {
    String title;
    String image;
    String cover;
    Boolean isPublic;
    List<Tag> tags;
    String accountId;
    Instant sheduleAt;
    List<String> songIds;

}
