package com.rhythm_of_soul.content_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.ArrayList;
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
    String accountId;      // Người comment
    String content;     // Nội dung comment
    String parentId ;    // ID comment cha (nếu là reply)
    String username;
    String userAvatar;
    boolean userIsArtist;
    Instant createdAt; // Thời gian tạo comment
    Instant updatedAt;
    List<CommentResponse> child_comments;// Danh sách comment con (nếu có)
    // Constructor
    public CommentResponse(String id, String accountId, String parentId, Instant createdAt, Instant updatedAt, String content) {
        this.id = id;
        this.accountId = accountId;
        this.parentId = parentId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.content = content;
        this.username = "User";
        this.userAvatar ="/assets/images/default/avatar.jpg";
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
