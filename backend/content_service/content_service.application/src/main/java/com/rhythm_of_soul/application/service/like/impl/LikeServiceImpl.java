package com.rhythm_of_soul.application.service.like.impl;

import com.rhythm_of_soul.application.service.like.LikeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeServiceImpl implements LikeService {
    @Override
    public boolean like(String accountId, String targetId) {
        return false;
    }

    @Override
    public boolean unlike(String accountId, String targetId) {
        return false;
    }

    @Override
    public boolean isLiked(String accountId, String targetId) {
        return false;
    }

    @Override
    public long countLikes(String targetId) {
        return 0;
    }

    @Override
    public List<String> getUserLikes(String targetId, int page, int size) {
        return List.of();
    }
}
