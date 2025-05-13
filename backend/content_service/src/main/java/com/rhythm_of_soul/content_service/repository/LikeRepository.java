package com.rhythm_of_soul.content_service.repository;

import com.rhythm_of_soul.content_service.dto.PostIdProjection;
import com.rhythm_of_soul.content_service.entity.Like;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findAllByPostId(String postId);
    Optional<Like> findByAccountIdAndPostId(String accountId, String postId);

    @Query(value = "{ 'accountId': ?0, 'postId': { $in: ?1 } }", fields = "{ 'postId': 1, '_id': 0 }")
    List<PostIdProjection> findLikedPostIdsByAccountIdAndPostIds(String accountId, List<String> postIds);

    boolean existsByAccountIdAndPostId(String accountId, String postId);
    void deleteByAccountIdAndPostId(String accountId, String postId);
    Page<Like> findByPostId(String postId, Pageable pageable);
}

