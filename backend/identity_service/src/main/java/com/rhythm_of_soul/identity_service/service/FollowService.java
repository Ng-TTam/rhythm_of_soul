package com.rhythm_of_soul.identity_service.service;

import com.rhythm_of_soul.identity_service.entity.User;

import java.util.List;

public interface FollowService {
  void follow(String followedId);
  void unfollow(String followedId);
  List<User> getFollowers(String userId);
}
