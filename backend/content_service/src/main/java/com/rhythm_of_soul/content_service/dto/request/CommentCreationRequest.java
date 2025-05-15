package com.rhythm_of_soul.content_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreationRequest {
    @NotBlank
    private String postId;

    @NotBlank
    private String content;
    private String parentId;
}
