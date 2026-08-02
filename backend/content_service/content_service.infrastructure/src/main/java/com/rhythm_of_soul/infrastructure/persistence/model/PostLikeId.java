package com.rhythm_of_soul.infrastructure.persistence.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class PostLikeId implements Serializable {
    @Column(name = "post_id")
    private String postId;
    @Column(name = "account_id")
    private String accountId;
}
