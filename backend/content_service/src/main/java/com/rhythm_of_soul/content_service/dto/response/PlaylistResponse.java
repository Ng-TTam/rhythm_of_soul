package com.rhythm_of_soul.content_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rhythm_of_soul.content_service.common.Tag;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlaylistResponse {
    String id;
    String title;
    String imageUrl;
    Boolean isLiked;
    List<Tag> tags;
    int tracks;
}
