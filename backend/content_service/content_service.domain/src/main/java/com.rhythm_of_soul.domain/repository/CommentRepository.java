package com.rhythm_of_soul.domain.repository;

import com.rhythm_of_soul.domain.model.entity.Comment;

import java.awt.print.Pageable;
import java.util.List;

public interface CommentRepository {
    Comment findById(String commentId);
    Comment save(Comment comment);
    void deleteById(String commentId);
    List<Comment> findByPostId(String postId);
    List<Comment> findAllByPostId(String postId);
    List<Comment> findByPostIdAndParentIdIsNullOrderByCreatedAtDesc(String postId, Pageable pageable);
    List<Comment> findByParentIdOrderByCreatedAtAsc(String parentId, Pageable pageable);
    void deleteWithChild(String commentId);
}
