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
@IdClass(PostLikeId.class)
public class LikeEntity {
    @EmbeddedId
    private PostLikeId id;
    private Instant createdAt;
}
