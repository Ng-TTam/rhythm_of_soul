package com.rhythm_of_soul.domain.model.entity;

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
    private String id;
    private String postId;
    private String accountId;
    private String content;
    private String parentId;
    private String username;
    private String userAvatar;
    private boolean userIsArtist;
    private Instant createdAt;
    private Instant updatedAt;
}

