package com.rhythm_of_soul.infrastructure.persistence.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "likes")
public class LikeEntity {
    @EmbeddedId
    private PostLikeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "post_id", 
            insertable = false, 
            updatable = false, 
            foreignKey = @ForeignKey(name = "fk_likes_post")
    )
    private PostEntity post;

    private Instant createdAt;
}
