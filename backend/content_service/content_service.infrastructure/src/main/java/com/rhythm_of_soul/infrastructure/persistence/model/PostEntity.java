package com.rhythm_of_soul.infrastructure.persistence.model;

import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.enums.Type;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Getter
@Setter
@Builder
@Entity
@Table(name = "posts")
@NoArgsConstructor
@AllArgsConstructor
public class PostEntity {
    @Id
    private String id;
    private String accountId;
    private Type type;
    private String caption;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Content content;

    private int viewCount;
    private int likeCount;
    private int commentCount;
    private boolean isPublic;
    private Instant createdAt;
    private Instant updatedAt;
    private boolean isDeleted;
    private Instant deletedAt;
    private Instant scheduledAt;
}
