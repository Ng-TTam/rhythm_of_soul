package com.rhythm_of_soul.identity_service.api;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.rhythm_of_soul.identity_service.dto.request.ArtistProfileRequest;
import com.rhythm_of_soul.identity_service.dto.request.UserUpdateRequest;
import com.rhythm_of_soul.identity_service.dto.response.ApiResponse;
import com.rhythm_of_soul.identity_service.dto.response.PageResponse;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;
import com.rhythm_of_soul.identity_service.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;

    public static final String SUCCESS = "Success";

    // update user or artist
    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUserProfile(
            @PathVariable String userId, @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        return ApiResponse.<UserResponse>builder()
                .message(SUCCESS)
                .result(userService.updateUser(userId, userUpdateRequest))
                .build();
    }

    //    @GetMapping("/{userId}")
    //    ApiResponse<UserResponse> getUserProfile(@PathVariable String userId) {
    //        return ApiResponse.<UserResponse>builder()
    //                .message(SUCCESS)
    //                .result(userService.getUser(userId))
    //                .build();
    //    }

    @GetMapping("/{preEmail}")
    ApiResponse<UserResponse> getUserProfileByEmail(@PathVariable String preEmail) {
        return ApiResponse.<UserResponse>builder()
                .message(SUCCESS)
                .result(userService.getUserByEmail(preEmail))
                .build();
    }

    @GetMapping
    ApiResponse<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page) {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .message(SUCCESS)
                .result(userService.getAllUsers(page, size))
                .build();
    }

    @PostMapping("/assign-artist")
    ApiResponse<Void> assignArtist(@Valid @RequestBody ArtistProfileRequest artistProfileRequest) {
        userService.assignRoleArtist(artistProfileRequest);
        return ApiResponse.<Void>builder()
                .message("Assign artist successful!!!")
                .build();
    }

    @PostMapping("/upgrade-artist/{userId}")
    ApiResponse<Void> upgradeArtist(@PathVariable String userId) {
        userService.upgradeRoleArtist(userId);
        return ApiResponse.<Void>builder()
                .message("Upgrade artist successful!!!")
                .build();
    }

    @PostMapping("/revoke-artist/{userId}")
    ApiResponse<Void> revokeArtist(@PathVariable String userId) {
        userService.revokeRoleArtist(userId);
        return ApiResponse.<Void>builder()
                .message("Revoke artist successful!!!")
                .build();
    }
}
