package com.rhythm_of_soul.infrastructure.persistence.adapter;

import com.rhythm_of_soul.domain.model.entity.Like;
import com.rhythm_of_soul.domain.repository.LikeRepository;
import com.rhythm_of_soul.infrastructure.persistence.mapper.LikePersistenceMapper;
import com.rhythm_of_soul.infrastructure.persistence.repository.LikeJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LikeRepositoryAdapter implements LikeRepository {
    private final LikeJpaRepository likeJpaRepository;
    private final LikePersistenceMapper likeMapper;

    LikeRepositoryAdapter(LikeJpaRepository likeJpaRepository, LikePersistenceMapper likeMapper){
        this.likeMapper = likeMapper;
        this.likeJpaRepository = likeJpaRepository;
    }

    @Override
    public boolean exists(String postId, String userId) {
        return likeJpaRepository.exists(postId, userId);
    }

    @Override
    public Page<Like> findByPostId(String postId, Pageable pageable) {
        return likeJpaRepository.findByIdPostId(postId, pageable)
                .map(likeMapper::toDomain);
    }

    @Override
    public List<Like> findAllByPostId(String postId) {
        return likeJpaRepository.findAllByIdPostId(postId)
                .stream()
                .map(likeMapper::toDomain)
                .toList();
    }

    @Override
    public void save(String postId, String userId) {
        likeJpaRepository.save(postId, userId);
    }

    @Override
    public void deleteByAccountIdAndPostId(String postId, String userId) {
        likeJpaRepository.deleteByIdAccountIdAndIdPostId(postId, userId);
    }

    @Override
    public boolean existsByAccountIdAndPostId(String accountId, String postId) {
        return likeJpaRepository.existsByIdAccountIdAndIdPostId(accountId, postId);
    }
}
