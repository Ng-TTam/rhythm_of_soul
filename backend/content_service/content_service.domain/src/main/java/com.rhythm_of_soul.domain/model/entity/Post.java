package com.rhythm_of_soul.domain.model.entity;

import com.rhythm_of_soul.domain.model.enums.Type;

import java.time.Instant;

public class Post {
    private String id;
    private String accountId;
    private Type type;
    private String caption;
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

    public void editTitle(String caption){

    }

    public void delete(){

    }
}