package com.rhythm_of_soul.domain.model.entity;

import java.time.Instant;

public class Comment {

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

