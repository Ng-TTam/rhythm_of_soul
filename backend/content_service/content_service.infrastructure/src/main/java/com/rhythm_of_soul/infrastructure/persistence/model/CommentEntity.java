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
    @jakarta.persistence.Column(name = "post_id")
    private String postId;
    
    @jakarta.persistence.ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @jakarta.persistence.JoinColumn(
            name = "post_id", 
            insertable = false, 
            updatable = false, 
            foreignKey = @jakarta.persistence.ForeignKey(name = "fk_comments_post")
    )
    private PostEntity post;

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
