package com.rhythm_of_soul.identity_service.api;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rhythm_of_soul.identity_service.dto.request.ArtistProfileRequest;
import com.rhythm_of_soul.identity_service.dto.request.UserUpdateRequest;
import com.rhythm_of_soul.identity_service.dto.response.ApiResponse;
import com.rhythm_of_soul.identity_service.dto.response.InformationResponse;
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
    @GetMapping("/information/{accountId}")
    ApiResponse<InformationResponse> getUserProfile(@PathVariable String accountId) {
        return ApiResponse.<InformationResponse>builder()
                .message(SUCCESS)
                .result(userService.getInformation(accountId))
                .build();
    }

    @GetMapping("/{preEmail}")
    ApiResponse<UserResponse> getUserProfileByEmail(@PathVariable String preEmail) {
        return ApiResponse.<UserResponse>builder()
                .message(SUCCESS)
                .result(userService.getUserByEmail(preEmail))
                .build();
    }

    @GetMapping("/me")
    ApiResponse<UserResponse> getMe() {
        return ApiResponse.<UserResponse>builder()
                .message(SUCCESS)
                .result(userService.getMe())
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

    @GetMapping("/searchUser")
    @PreAuthorize("hasAnyRole('USER', 'ARTIST')")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchKey) {
        PageResponse<UserResponse> result = userService.getAllUsers(page, size, searchKey);
        return ResponseEntity.ok(ApiResponse.<PageResponse<UserResponse>>builder()
                .code(200)
                .message("Search users successfully")
                .result(result)
                .build());
    }

    @GetMapping("/artist-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getArtistRequests() {
        List<UserResponse> result = userService.getAllArtistRequestUsers();
        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder()
                .code(200)
                .message("Fetched artist requests successfully")
                .result(result)
                .build());
    }
}
