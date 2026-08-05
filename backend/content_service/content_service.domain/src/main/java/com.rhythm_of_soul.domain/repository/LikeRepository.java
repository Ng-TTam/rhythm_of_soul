package com.rhythm_of_soul.domain.repository;

import com.rhythm_of_soul.domain.model.entity.Like;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LikeRepository {

    boolean exists(String postId, String userId);

    Page<Like> findByPostId(String postId, Pageable pageable);

    List<Like> findAllByPostId(String Post);

    void save(String postId, String userId);

    void deleteByAccountIdAndPostId(String postId, String userId);

    boolean existsByAccountIdAndPostId(String accountId, String postId);
}