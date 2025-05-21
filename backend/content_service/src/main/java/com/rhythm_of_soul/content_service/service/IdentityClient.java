package com.rhythm_of_soul.content_service.service;

import com.rhythm_of_soul.content_service.dto.response.UserBasicInfoResponse;

import java.util.List;

public interface IdentityClient {
  List<String> getFollowerIds(String userId);
  UserBasicInfoResponse getUserInfoByAccountId(String accountId);
}
