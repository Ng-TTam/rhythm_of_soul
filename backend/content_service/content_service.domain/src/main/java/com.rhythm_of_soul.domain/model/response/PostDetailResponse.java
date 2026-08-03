package com.rhythm_of_soul.domain.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostDetailResponse {
    private PostResponse post;
    private List<LikeResponse> likes;
    private List<CommentResponse> comments;
}
