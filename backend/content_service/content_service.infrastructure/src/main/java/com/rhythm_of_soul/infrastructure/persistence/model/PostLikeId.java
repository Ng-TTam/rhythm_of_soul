package com.rhythm_of_soul.infrastructure.persistence.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class PostLikeId implements Serializable {
    @Column(name = "post_id")
    private String postId;
    @Column(name = "account_id")
    private String accountId;
}
