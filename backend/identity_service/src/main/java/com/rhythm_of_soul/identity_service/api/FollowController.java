package com.rhythm_of_soul.identity_service.api;

import com.rhythm_of_soul.identity_service.dto.response.ApiResponse;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;
import com.rhythm_of_soul.identity_service.entity.User;
import com.rhythm_of_soul.identity_service.service.FollowService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class FollowController {
  private final FollowService followService;

  @PostMapping("/follow/{followedId}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<Void>> follow(@PathVariable String followedId) {
    followService.follow(followedId);
    return ResponseEntity.ok(ApiResponse.<Void>builder()
            .message("Followed successfully")
            .build());
  }

  @DeleteMapping("/unfollow/{followedId}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<Void>> unfollow(@PathVariable String followedId) {
    followService.unfollow(followedId);
    return ResponseEntity.ok(ApiResponse.<Void>builder()
            .message("Unfollowed successfully")
            .build());
  }

  @GetMapping("/{userId}/followers")
  public ResponseEntity<ApiResponse<List<UserResponse>>> getFollowers(@PathVariable String userId) {
    List<User> followers = followService.getFollowers(userId);
    List<UserResponse> response = followers.stream()
            .map(UserResponse::fromEntity)
            .collect(Collectors.toList());

    ApiResponse<List<UserResponse>> apiResponse = ApiResponse.<List<UserResponse>>builder()
            .result(response)
            .message("Get all follower succes")
            .build();

    return ResponseEntity.ok(apiResponse);
  }

}
