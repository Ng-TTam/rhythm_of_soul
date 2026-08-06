package com.rhythm_of_soul.infrastructure.persistence.repository;

import com.rhythm_of_soul.infrastructure.persistence.model.LikeEntity;
import com.rhythm_of_soul.infrastructure.persistence.model.PostLikeId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeJpaRepository extends JpaRepository<LikeEntity, PostLikeId> {
    boolean exists(String postId, String userId);

    void save(String postId, String userId);

    void delete(String postId, String userId);

    Page<LikeEntity> findByIdPostId(String postId, Pageable pageable);

    List<LikeEntity> findAllByIdPostId(String postId);

    boolean existsByIdAccountIdAndIdPostId(String accountId, String postId);

    void deleteByIdAccountIdAndIdPostId(String idAccountId, String idPostId);
}
