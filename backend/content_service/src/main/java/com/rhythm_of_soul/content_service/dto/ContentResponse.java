package com.rhythm_of_soul.content_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rhythm_of_soul.content_service.common.Tag;
import com.rhythm_of_soul.content_service.dto.response.SongResponse;
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
public class ContentResponse {
    String title;
    String mediaUrl;
    String imageUrl;
    String coverUrl;
    String originalPostId;
    List<Tag> tags;
    List<SongResponse> songIds;

}
