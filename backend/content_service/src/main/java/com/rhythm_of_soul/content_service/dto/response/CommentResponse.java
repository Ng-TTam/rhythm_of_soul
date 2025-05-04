package com.rhythm_of_soul.content_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentResponse {
    String id;          // comment_id
    String userId;      // Người comment
    String content;     // Nội dung comment
    String parentId; // ID comment cha (nếu là reply)
    Date createdAt; // Thời gian tạo comment
    List<CommentResponse> child_comments;// Danh sách comment con (nếu có)
    // Constructor
    public CommentResponse(String id, String userId, String parentId,Date createdAt, String content) {
        this.id = id;
        this.userId = userId;
        this.parentId = parentId;
        this.createdAt = createdAt;
        this.content = content;
    }


    // Method to add sub-department to the parent department
    public void addSubComment(CommentResponse child_comment) {
        if (this.child_comments == null) {
            this.child_comments = new ArrayList<>();
        }
        // Avoid adding duplicates
        if (!this.child_comments.contains(child_comment)) {
            this.child_comments.add(child_comment);
        }
    }
}
