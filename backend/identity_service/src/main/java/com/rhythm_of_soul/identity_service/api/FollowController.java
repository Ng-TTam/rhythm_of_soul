package com.rhythm_of_soul.identity_service.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rhythm_of_soul.identity_service.dto.response.ApiResponse;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;
import com.rhythm_of_soul.identity_service.entity.User;
import com.rhythm_of_soul.identity_service.service.FollowService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class FollowController {
    private final FollowService followService;

    @PostMapping("/follow/{followedId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> follow(@PathVariable String followedId) {
        followService.follow(followedId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder().message("Followed successfully").build());
    }

    @DeleteMapping("/unfollow/{followedId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> unfollow(@PathVariable String followedId) {
        followService.unfollow(followedId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder().message("Unfollowed successfully").build());
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getFollowers(@PathVariable String userId) {
        List<User> followers = followService.getFollowers(userId);
        List<UserResponse> response =
                followers.stream().map(UserResponse::cvFromEntity).collect(Collectors.toList());

        ApiResponse<List<UserResponse>> apiResponse = ApiResponse.<List<UserResponse>>builder()
                .result(response)
                .message("Get all follower successfully")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{userId}/followingIds")
    @PreAuthorize("hasAnyRole('USER', 'ARTIST')")
    public ResponseEntity<ApiResponse<List<String>>> getFollowingUserIds(@PathVariable String userId) {
        List<String> followingUserIds = followService.getFollowingUserIds(userId);

        ApiResponse<List<String>> apiResponse = ApiResponse.<List<String>>builder()
                .result(followingUserIds)
                .message("Get all following users successfully")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{userId}/following")
    @PreAuthorize("hasAnyRole('USER', 'ARTIST')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getFollowingUsers(@PathVariable String userId) {
        List<User> followingUsers = followService.getFollowingUsers(userId);
        List<UserResponse> response =
                followingUsers.stream().map(UserResponse::cvFromEntity).collect(Collectors.toList());

        ApiResponse<List<UserResponse>> apiResponse = ApiResponse.<List<UserResponse>>builder()
                .result(response)
                .message("Get all followed users successfully")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
