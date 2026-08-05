package com.rhythm_of_soul.application.service.Identity;

import com.rhythm_of_soul.application.model.response.UserBasicInfoResponse;

import java.util.List;

public interface IdentityClient {
  List<String> getFollowerIds(String userId);
  UserBasicInfoResponse getUserInfoByAccountId(String accountId);
}
