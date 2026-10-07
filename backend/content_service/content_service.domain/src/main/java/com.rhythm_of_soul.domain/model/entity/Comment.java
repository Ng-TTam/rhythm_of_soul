package com.rhythm_of_soul.domain.model.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
public class Comment {
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

