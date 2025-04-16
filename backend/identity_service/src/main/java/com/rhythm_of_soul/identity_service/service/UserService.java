package com.rhythm_of_soul.identity_service.service;

import com.rhythm_of_soul.identity_service.dto.request.UserCreatedRequest;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;

public interface UserService {
    UserResponse createUser(UserCreatedRequest request);
    Object forgetPassword(String email);
}
