package com.rhythm_of_soul.application.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rhythm_of_soul.domain.model.enums.Tag;
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
