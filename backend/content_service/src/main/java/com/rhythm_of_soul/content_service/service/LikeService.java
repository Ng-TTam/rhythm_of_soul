package com.rhythm_of_soul.content_service.service;

import java.util.List;

public interface LikeService {

    /**
     * Thực hiện like cho một bài viết cụ thể.
     *
     * @param accountId     ID người dùng thực hiện like
     * @param targetId   ID của đối tượng được like
     * @return true nếu like thành công, false nếu đã like trước đó
     */
    boolean like(String accountId, String targetId);

    /**
     * Bỏ like khỏi một đối tượng cụ thể.
     *
     * @param accountId     ID người dùng thực hiện unlike
     * @param targetId   ID của đối tượng đã like
     * @return true nếu bỏ like thành công, false nếu chưa like
     */
    boolean unlike(String accountId, String targetId);

    /**
     * Kiểm tra một người dùng đã like đối tượng hay chưa.
     *
     * @param accountId     ID người dùng
     * @param targetId   ID đối tượng
     * @return true nếu đã like, false nếu chưa
     */
    boolean isLiked(String accountId, String targetId);

    /**
     * Đếm tổng số lượt like cho một đối tượng.
     *
     * @param targetId   ID của đối tượng
     * @return số lượt like
     */
    long countLikes(String targetId);

    /**
     * Lấy danh sách accountId đã like một đối tượng, hỗ trợ phân trang.
     *
     * @param targetId   ID đối tượng được like
     * @param page       số trang (bắt đầu từ 0)
     * @param size       kích thước trang (số lượng user mỗi lần gọi)
     * @return danh sách userId
     */
    List<String> getUserLikes(String targetId, int page, int size);
}
