package com.rhythm_of_soul.identity_service.dto.request;

import lombok.Data;

@Data
public class LockAccountRequest {
  private String reason;
}