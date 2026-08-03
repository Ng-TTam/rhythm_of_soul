package com.rhythm_of_soul.controller.model.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UserBasicInfoResponse {
  private String userId;
  private String name;
}
