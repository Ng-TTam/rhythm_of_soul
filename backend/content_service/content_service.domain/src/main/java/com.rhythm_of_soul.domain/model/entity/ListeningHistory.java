package com.rhythm_of_soul.domain.model.entity;

import com.rhythm_of_soul.domain.model.enums.Tag;

import java.time.Instant;
import java.util.List;

public class ListeningHistory {

    private String id;
    private String accountId;
    private String sessionId;
    private String postId;
    private List<Tag> tag;
    private Instant listenAt;
}
