package com.rhythm_of_soul.identity_service.service;

import com.rhythm_of_soul.identity_service.dto.request.UserUpdateRequest;
import com.rhythm_of_soul.identity_service.dto.response.PageResponse;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;

public interface UserService {
    UserResponse updateUser(String userId, UserUpdateRequest userUpdateRequest);
    UserResponse getUser(String userId);
    PageResponse<UserResponse> getAllUsers(int page, int size);

}
