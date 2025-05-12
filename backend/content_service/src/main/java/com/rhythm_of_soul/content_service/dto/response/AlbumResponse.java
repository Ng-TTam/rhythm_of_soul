package com.rhythm_of_soul.content_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rhythm_of_soul.content_service.common.Tag;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class AlbumResponse {
    String id; // album_id
    String title; // Tên album
    String imageUrl; // Đường dẫn đến ảnh bìa album
    String coverUrl; // Đường dẫn đến ảnh bìa album
    String userId; // ID người tạo album
    int tracks; // Số lượng bài hát trong album
    List<Tag> tags; // Danh sách tag của album
    Date crateAt;
    Boolean isPublic; // Thời gian phát hành album
    Date updatedAt; // Thời gian cập nhật album
    Date scheduledAt; // Thời gian phát hành album
    int viewCount; // Số lượt xem album
    int likeCount; // Số lượt thích album
    int commentCount; // Số lượng bình luận album
}
