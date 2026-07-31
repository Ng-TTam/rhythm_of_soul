package com.rhythm_of_soul.domain.repository;

public interface LikeRepository {

    boolean exists(String postId, String userId);

    void save(String postId, String userId);

    void delete(String postId, String userId);

}