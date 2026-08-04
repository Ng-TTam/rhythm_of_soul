package com.rhythm_of_soul.application.service.comment;

import com.rhythm_of_soul.application.model.request.CommentCreationRequest;
import com.rhythm_of_soul.application.model.request.CommentReportRequest;
import com.rhythm_of_soul.application.model.request.CommentUpdateRequest;
import com.rhythm_of_soul.application.model.response.CommentResponse;

import java.util.List;

public interface CommentService {

    CommentResponse createComment(CommentCreationRequest request);

    List<CommentResponse> getTopLevelComments(String postId, int page, int size);

    List<CommentResponse> getReplies(String parentCommentId, int page, int size);

    CommentResponse updateComment(String commentId, CommentUpdateRequest request);

    void deleteComment(String commentId);

    long countCommentsByPost(String postId);

    void reportComment(String commentId, String accountId, CommentReportRequest request);
}
