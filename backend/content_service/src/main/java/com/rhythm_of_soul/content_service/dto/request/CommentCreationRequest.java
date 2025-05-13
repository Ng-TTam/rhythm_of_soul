package com.rhythm_of_soul.content_service.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreationRequest {
    private String postId;
    private String content;
    private String parentId;
}
