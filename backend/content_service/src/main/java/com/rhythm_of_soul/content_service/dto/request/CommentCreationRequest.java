package com.rhythm_of_soul.content_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreationRequest {
    @NotBlank(message = "BLANK_POST_ID")
    private String postId;

    @NotBlank(message = "BLANK_COMMENT")
    private String content;
    private String parentId;
}
