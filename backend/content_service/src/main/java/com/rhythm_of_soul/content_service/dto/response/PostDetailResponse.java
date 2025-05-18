package com.rhythm_of_soul.content_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rhythm_of_soul.content_service.dto.PostResponse;
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
public class PostDetailResponse {
    PostResponse post;
    List<LikeResponse> likes;
    List<CommentResponse> comments;
}
