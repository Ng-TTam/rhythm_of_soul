package com.rhythm_of_soul.domain.service;

import java.util.List;

public interface LikeService {

    boolean like(String accountId, String targetId);

    boolean unlike(String accountId, String targetId);

    boolean isLiked(String accountId, String targetId);

    long countLikes(String targetId);

    List<String> getUserLikes(String targetId, int page, int size);
}
