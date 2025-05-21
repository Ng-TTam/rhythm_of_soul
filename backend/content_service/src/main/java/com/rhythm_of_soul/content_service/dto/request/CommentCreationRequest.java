package com.rhythm_of_soul.content_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreationRequest {
    @NotBlank(message = "BLANK_POST_ID")
    private String postId;

    @NotNull(message = "No field username")
    @NotBlank(message = "BLANK_COMMENT_USER_NAME")
    private String username;
    private String userAvatar;

    @NotBlank(message = "BLANK_COMMENT")
    private String content;
    private String parentId;
}
