package com.rhythm_of_soul.identity_service.api;

import com.rhythm_of_soul.identity_service.dto.request.UserUpdateRequest;
import com.rhythm_of_soul.identity_service.dto.response.ApiResponse;
import com.rhythm_of_soul.identity_service.dto.response.PageResponse;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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

    //update user or artist
    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUserProfile(@PathVariable String userId,
                                                @Valid @RequestBody UserUpdateRequest userUpdateRequest){
        return ApiResponse.<UserResponse>builder()
                .message(SUCCESS)
                .result(userService.updateUser(userId, userUpdateRequest))
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUserProfile(@PathVariable String userId){
        return ApiResponse.<UserResponse>builder()
                .message(SUCCESS)
                .result(userService.getUser(userId))
                .build();
    }

    @GetMapping
    ApiResponse<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page){
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .message(SUCCESS)
                .result(userService.getAllUsers(page, size))
                .build();
    }
}
