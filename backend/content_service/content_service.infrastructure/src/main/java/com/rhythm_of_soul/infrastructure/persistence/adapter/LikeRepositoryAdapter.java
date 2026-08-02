package com.rhythm_of_soul.infrastructure.persistence.adapter;

import com.rhythm_of_soul.domain.repository.LikeRepository;
import com.rhythm_of_soul.infrastructure.persistence.repository.LikeJpaRepository;
import org.springframework.stereotype.Component;

@Component
public class LikeRepositoryAdapter implements LikeRepository {
    private final LikeJpaRepository likeJpaRepository;

    LikeRepositoryAdapter(LikeJpaRepository likeJpaRepository){
        this.likeJpaRepository = likeJpaRepository;
    }

    @Override
    public boolean exists(String postId, String userId) {
        return likeJpaRepository.exists(postId, userId);
    }

    @Override
    public void save(String postId, String userId) {
        likeJpaRepository.save(postId, userId);
    }

    @Override
    public void delete(String postId, String userId) {
        likeJpaRepository.delete(postId, userId);
    }
}
