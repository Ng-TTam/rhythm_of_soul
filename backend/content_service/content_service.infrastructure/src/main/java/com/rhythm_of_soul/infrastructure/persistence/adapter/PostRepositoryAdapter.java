package com.rhythm_of_soul.infrastructure.persistence.adapter;

import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.repository.PostRepository;
import com.rhythm_of_soul.infrastructure.persistence.mapper.PostMapper;
import com.rhythm_of_soul.infrastructure.persistence.repository.PostJpaRepository;
import org.springframework.stereotype.Component;

import java.awt.print.Pageable;
import java.util.List;

@Component
public class PostRepositoryAdapter implements PostRepository {
    private final PostJpaRepository postJpaRepository;
    private final PostMapper postMapper;

    public PostRepositoryAdapter(PostJpaRepository postJpaRepository, PostMapper postMapper){
        this.postJpaRepository = postJpaRepository;
        this.postMapper = postMapper;
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
}
