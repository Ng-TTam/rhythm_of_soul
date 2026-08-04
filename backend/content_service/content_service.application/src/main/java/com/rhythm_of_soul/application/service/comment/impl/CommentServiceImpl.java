package com.rhythm_of_soul.application.service.comment.impl;

import com.rhythm_of_soul.application.model.request.CommentCreationRequest;
import com.rhythm_of_soul.application.model.request.CommentReportRequest;
import com.rhythm_of_soul.application.model.request.CommentUpdateRequest;
import com.rhythm_of_soul.application.model.response.CommentResponse;
import com.rhythm_of_soul.application.service.comment.CommentService;
import com.rhythm_of_soul.domain.repository.CommentRepository;
import com.rhythm_of_soul.domain.repository.PostRepository;

import java.util.List;

public class CommentServiceImpl implements CommentService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    CommentServiceImpl(PostRepository postRepository, CommentRepository commentRepository){
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;

    }

    @Override
    public CommentResponse createComment(CommentCreationRequest request) {
        return null;
    }

    @Override
    public List<CommentResponse> getTopLevelComments(String postId, int page, int size) {
        return List.of();
    }

    @Override
    public List<CommentResponse> getReplies(String parentCommentId, int page, int size) {
        return List.of();
    }

    @Override
    public CommentResponse updateComment(String commentId, CommentUpdateRequest request) {
        return null;
    }

    @Override
    public void deleteComment(String commentId) {

    }

    @Override
    public long countCommentsByPost(String postId) {
        return 0;
    }

    @Override
    public void reportComment(String commentId, String accountId, CommentReportRequest request) {

    }
}
