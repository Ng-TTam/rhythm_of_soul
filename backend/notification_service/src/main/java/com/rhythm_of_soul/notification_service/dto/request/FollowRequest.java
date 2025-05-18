package com.rhythm_of_soul.notification_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowRequest {
  private String followerId;
  private String followerName;
  private String followedId;
}
