package com.rhythm_of_soul.identity_service.service;


import org.springframework.security.access.AccessDeniedException;

import com.rhythm_of_soul.identity_service.dto.request.ArtistProfileRequest;
import com.rhythm_of_soul.identity_service.dto.request.UserUpdateRequest;
import com.rhythm_of_soul.identity_service.dto.response.InformationResponse;
import com.rhythm_of_soul.identity_service.dto.response.PageResponse;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;

public interface UserService {
    UserResponse updateUser(String userId, UserUpdateRequest userUpdateRequest);

    UserResponse getUser(String userId);

    UserResponse getMe();

    InformationResponse getInformation(String acccountId);

    UserResponse getUserByEmail(String email);

    PageResponse<UserResponse> getAllUsers(int page, int size);

    /**
     * User assign ARTIST role for user.
     *
     * @param artistProfileRequest extra profile of artist
     * @throws AccessDeniedException if user haven't permission
     * @throws IllegalArgumentException if userId or roleName invalid
     */
    void assignRoleArtist(ArtistProfileRequest artistProfileRequest);

    /**
     * Admin submit ARTIST role of user.
     *
     * @param userId ID user
     * @throws AccessDeniedException if user haven't permission -> ADMIN can
     * @throws IllegalArgumentException if userId or roleName invalid
     */
    void upgradeRoleArtist(String userId);

    /**
     * Admin revoke ARTIST role of user.
     *
     * @param userId ID user
     * @throws AccessDeniedException if user haven't permission -> ADMIN can
     * @throws IllegalArgumentException if userId or roleName invalid
     */
    void revokeRoleArtist(String userId);

    //    Tìm kiếm người dùng để follow
    PageResponse<UserResponse> getAllUsers(int page, int size, String searchKey);

    PageResponse<UserResponse> getAllArtistRequestUsers(int page, int size, String searchKey, String status);
}
