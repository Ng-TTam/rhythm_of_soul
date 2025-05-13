package com.rhythm_of_soul.content_service.repository;

import com.rhythm_of_soul.content_service.entity.Like;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findAllByPostId(String postId);
    Optional<Like> findByAccountIdAndPostId(String accountId, String postId);
    boolean existsByAccountIdAndPostId(String accountId, String postId);
    void deleteByAccountIdAndPostId(String accountId, String postId);
    Page<Like> findByPostId(String targetId, Pageable pageable);
}

