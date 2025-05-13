package com.rhythm_of_soul.content_service.service;

import com.rhythm_of_soul.content_service.dto.request.CommentCreationRequest;
import com.rhythm_of_soul.content_service.dto.request.CommentReportRequest;
import com.rhythm_of_soul.content_service.dto.request.CommentUpdateRequest;
import com.rhythm_of_soul.content_service.dto.response.CommentResponse;

import java.util.List;

public interface CommentService {

    /**
     * Create new comment for post.
     *
     * @param request Nội dung comment và comment cha nếu là reply.
     * @return Thông tin comment đã tạo.
     */
    CommentResponse createComment(CommentCreationRequest request);

    /**
     * Lấy danh sách comment cha cho một bài viết, với phân trang và giới hạn số lượng comment con trả về.
     *
     * @param postId ID của bài viết cần lấy comment.
     * @param page Trang hiện tại.
     * @param size Số lượng comment cần lấy.
     * @return Danh sách CommentResponse chứa thông tin các comment cha.
     */
    List<CommentResponse> getTopLevelComments(String postId, int page, int size);

    /**
     * Lấy thêm các reply (comment con) của một comment cha, với phân trang.
     *
     * @param parentCommentId ID của comment cha.
     * @param page Trang hiện tại.
     * @param size Số lượng reply cần lấy.
     * @return Danh sách CommentResponse chứa thông tin các comment con.
     */
    List<CommentResponse> getReplies(String parentCommentId, int page, int size);

    /**
     * Cập nhật nội dung comment (chỉ cho phép người tạo).
     *
     * @param commentId ID của comment cần cập nhật.
     * @param request   Nội dung mới.
     * @return Comment đã cập nhật.
     */
    CommentResponse updateComment(String commentId, CommentUpdateRequest request);

    /**
     * Xoá một comment (chỉ cho phép người tạo hoặc admin).
     *
     * @param commentId ID của comment.
     */
    void deleteComment(String commentId);

    /**
     * Trả về tổng số comment cho một bài viết.
     *
     * @param postId ID bài viết.
     * @return Tổng số comment.
     */
    long countCommentsByPost(String postId);

    /**
     * Báo cáo một comment vi phạm.
     *
     * @param commentId ID của comment bị báo cáo.
     * @param accountId    ID người dùng báo cáo.
     * @param request   Lý do báo cáo.
     */
    void reportComment(String commentId, String accountId, CommentReportRequest request);
}
