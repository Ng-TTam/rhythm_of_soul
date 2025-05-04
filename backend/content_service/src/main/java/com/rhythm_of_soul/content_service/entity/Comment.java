package com.rhythm_of_soul.content_service.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;          // comment_id
    private String postId;      // ID bài gốc
    private String userId;      // Người comment
    private String content;     // Nội dung comment
    private String parentId;    // ID comment cha (nếu là reply)
    private Instant createdAt;
}

