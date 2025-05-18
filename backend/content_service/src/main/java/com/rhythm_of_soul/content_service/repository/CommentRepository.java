package com.rhythm_of_soul.content_service.repository;

import com.rhythm_of_soul.content_service.entity.Comment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    List<Comment> findAllByPostId(String postId);
    List<Comment> findByPostIdAndParentIdIsNullOrderByCreatedAtDesc(String postId, Pageable pageable);
    List<Comment> findByParentIdOrderByCreatedAtAsc(String parentId, Pageable pageable);
    void deleteByParentId(String parentId);
}
