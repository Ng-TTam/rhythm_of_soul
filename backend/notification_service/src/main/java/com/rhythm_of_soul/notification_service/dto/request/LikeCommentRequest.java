package com.rhythm_of_soul.notification_service.dto.request;

import com.rhythm_of_soul.notification_service.constant.NotiType;
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
  private NotiType type;  //LIKE or COMMENT

}
