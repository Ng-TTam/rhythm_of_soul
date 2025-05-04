package com.rhythm_of_soul.content_service.dto.resquest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rhythm_of_soul.content_service.common.Tag;
import com.rhythm_of_soul.content_service.common.Type;
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
    String title;
    String mediaUrl;
    String imageUrl;
    String coverUrl;
    String originalPostId;
    List<Tag> tags;
    List<String> songIds;
}
