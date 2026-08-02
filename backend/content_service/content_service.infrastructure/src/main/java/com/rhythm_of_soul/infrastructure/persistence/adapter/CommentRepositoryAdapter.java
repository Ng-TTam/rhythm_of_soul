package com.rhythm_of_soul.infrastructure.persistence.adapter;

import com.rhythm_of_soul.domain.model.entity.Comment;
import com.rhythm_of_soul.domain.repository.CommentRepository;
import com.rhythm_of_soul.infrastructure.persistence.mapper.CommentMapper;
import com.rhythm_of_soul.infrastructure.persistence.repository.CommentJpaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Component;

import java.awt.print.Pageable;
import java.util.List;

@Component
public class CommentRepositoryAdapter implements CommentRepository {
    private final CommentJpaRepository commentJpaRepository;
    private final CommentMapper commentMapper;

    CommentRepositoryAdapter(CommentJpaRepository commentJpaRepository, CommentMapper commentMapper){
        this.commentJpaRepository = commentJpaRepository;
        this.commentMapper = commentMapper;
    }

    @Override
    public List<Comment> findByPostId(String postId) {
        return commentJpaRepository.findByPostId(postId)
                .stream()
                .map(commentMapper::toDomain)
                .toList();
    }

    @Override
    public List<Comment> findAllByPostId(String postId) {
        return commentJpaRepository.findAllByPostId(postId)
                .stream()
                .map(commentMapper::toDomain)
                .toList();
    }

    @Override
    public List<Comment> findByPostIdAndParentIdIsNullOrderByCreatedAtDesc(String postId, Pageable pageable) {
        return commentJpaRepository.findByPostIdAndParentIdIsNullOrderByCreatedAtDesc(postId, pageable)
                .stream()
                .map(commentMapper::toDomain)
                .toList();
    }

    @Override
    public List<Comment> findByParentIdOrderByCreatedAtAsc(String parentId, Pageable pageable) {
        return commentJpaRepository.findByParentIdOrderByCreatedAtAsc(parentId, pageable)
                .stream()
                .map(commentMapper::toDomain)
                .toList();
    }

    @Override
    public void deleteWithChild(String commentId) {
        if (!commentJpaRepository.existsById(commentId)) {
            throw new EntityNotFoundException("Comment not found: " + commentId);
        }

        commentJpaRepository.deleteWithChild(commentId);
    }
}
