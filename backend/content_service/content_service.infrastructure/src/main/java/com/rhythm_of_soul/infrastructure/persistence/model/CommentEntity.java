package com.rhythm_of_soul.infrastructure.persistence.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comments")
public class CommentEntity {
    @Id
    private String id;
    private String postId;
    private String accountId;
    private String content;
    private String parentId;
    private String username;
    private String userAvatar;
    private boolean userIsArtist;
    private boolean isDeleted;
    private Instant createdAt;
    private Instant updatedAt;
}
