package com.rhythm_of_soul.controller.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LikeCommentRequest {
  private String authorId;
  private String postAuthorId;
  private String referenceId;
  private String authorName;
  private String type;  //LIKE or COMMENT

}
