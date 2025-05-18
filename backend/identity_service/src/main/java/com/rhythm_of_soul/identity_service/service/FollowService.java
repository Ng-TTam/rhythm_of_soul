package com.rhythm_of_soul.identity_service.service;

import java.util.List;

import com.rhythm_of_soul.identity_service.entity.User;

public interface FollowService {
    void follow(String followedId);

    void unfollow(String followedId);

    List<User> getFollowers(String userId);
    List<String> getFollowingUserIds(String userId);
    List<User> getFollowingUsers(String userId);

}
