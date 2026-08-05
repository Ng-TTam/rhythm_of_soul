package com.rhythm_of_soul.domain.model.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
public class Like {
    private String postId;
    private String accountId;
    private Instant createdAt;
}
