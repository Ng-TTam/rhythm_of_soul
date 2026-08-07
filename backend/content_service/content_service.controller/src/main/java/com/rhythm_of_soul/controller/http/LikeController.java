package com.rhythm_of_soul.controller.http;

import com.rhythm_of_soul.application.service.like.LikeService;
import com.rhythm_of_soul.domain.model.response.ApiResponse;
import com.rhythm_of_soul.infrastructure.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/likes")
public class LikeController {
    private final LikeService likeService;

    @PostMapping
    public ApiResponse<Boolean> like(@RequestParam("postId") String postId) {
        String accountId = SecurityUtils.getCurrentAccountId();

        boolean success = likeService.like(accountId, postId);

        return ApiResponse.<Boolean>builder()
                .message(success ? "Like successfully" : "Post liked")
                .build();
    }

    @DeleteMapping
    public ApiResponse<Boolean> unlike(@RequestParam("postId") String postId) {

        String accountId = SecurityUtils.getCurrentAccountId();

        boolean success = likeService.unlike(accountId, postId);

        return ApiResponse.<Boolean>builder()
                .message(success ? "Unlike successfully" : "Post unliked")
                .build();
    }

    @GetMapping
    public ApiResponse<List<String>> getUserLikes(
            @RequestParam("targetId") String targetId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {

        List<String> likedUsers = likeService.getUserLikes(targetId, page - 1, size);

        return ApiResponse.<List<String>>builder()
                .message("Liked users")
                .result(likedUsers)
                .build();
    }
}
