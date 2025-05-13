package com.rhythm_of_soul.content_service.controller;

import com.rhythm_of_soul.content_service.dto.ApiResponse;
import com.rhythm_of_soul.content_service.dto.request.CommentCreationRequest;
import com.rhythm_of_soul.content_service.dto.request.CommentUpdateRequest;
import com.rhythm_of_soul.content_service.dto.response.CommentResponse;
import com.rhythm_of_soul.content_service.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ApiResponse<CommentResponse> createComment(@RequestBody CommentCreationRequest commentCreationRequest) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.createComment(commentCreationRequest))
                .build();
    }

    @GetMapping("/top-level/{postId}")
    public ApiResponse<List<CommentResponse>> getTopLevelComments(
            @PathVariable String postId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getTopLevelComments(postId, page, size))
                .build();
    }

    @GetMapping("/replies/{parentCommentId}")
    public ApiResponse<List<CommentResponse>> getReplies(
            @PathVariable String parentCommentId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getReplies(parentCommentId, page, size))
                .build();
    }

    @PutMapping("/{commentId}") //using token to check permission update
    public ApiResponse<CommentResponse> updateComment(
            @PathVariable String commentId,
            @RequestBody CommentUpdateRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .message("Comment updated")
                .result(commentService.updateComment(commentId, request))
                .build();
    }

    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return ApiResponse.<Void>builder()
                .message("Delete comment successfully!!!")
                .build();
    }

    @GetMapping("/count/{postId}")
    public long getCommentCount(@PathVariable String postId) {
        return commentService.countCommentsByPost(postId);
    }
}

