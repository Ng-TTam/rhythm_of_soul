package com.rhythm_of_soul.content_service.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;          // comment_id
    private String postId;      // ID bài gốc
    private String accountId;      // Người comment
    private String content;     // Nội dung comment
    private String parentId;    // ID comment cha (nếu là reply)
    private String username;
    private String userAvatar;
    private boolean userIsArtist;
    private Instant createdAt;
    private Instant updatedAt;
}

