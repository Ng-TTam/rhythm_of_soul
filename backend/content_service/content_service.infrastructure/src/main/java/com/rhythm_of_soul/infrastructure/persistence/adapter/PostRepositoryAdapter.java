package com.rhythm_of_soul.infrastructure.persistence.adapter;

import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import com.rhythm_of_soul.domain.repository.PostRepository;
import com.rhythm_of_soul.infrastructure.persistence.mapper.PostPersistenceMapper;
import com.rhythm_of_soul.infrastructure.persistence.repository.PostJpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PostRepositoryAdapter implements PostRepository {
    private final PostJpaRepository postJpaRepository;
    private final PostPersistenceMapper postMapper;

    public PostRepositoryAdapter(PostJpaRepository postJpaRepository, PostPersistenceMapper postMapper){
        this.postJpaRepository = postJpaRepository;
        this.postMapper = postMapper;
    }

    @Override
    public Post findById(String postId) {
        return postJpaRepository.findById(postId)
                .map(postMapper::toDomain)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
    }

    @Override
    public List<Post> findAllByType(Type type, Pageable pageable) {
        return postJpaRepository.findAllByType(type, pageable)
                .stream()
                .map(postMapper::toDomain)
                .toList();
    }


    @Override
    public List<Post> findAllByAccountId(String accountId, Pageable pageable) {
        return postJpaRepository.findAllByAccountId(accountId, pageable)
                .stream()
                .map(postMapper::toDomain)
                .toList();
    }

    @Override
    public List<Post> findAllByAccountIdAndType(String accountId, Type type) {
        return postJpaRepository.findAllByAccountIdAndType(accountId, type)
                .stream()
                .map(postMapper::toDomain)
                .toList();
    }

    @Override
    public Post save(Post post) {
        return null;
    }
}
