package com.rhythm_of_soul.domain.repository;

import com.rhythm_of_soul.domain.model.entity.Comment;

import java.awt.print.Pageable;
import java.util.List;

public interface CommentRepository {
    List<Comment> findByPostId(String postId);
    List<Comment> findAllByPostId(String postId);
    List<Comment> findByPostIdAndParentIdIsNullOrderByCreatedAtDesc(String postId, Pageable pageable);
    List<Comment> findByParentIdOrderByCreatedAtAsc(String parentId, Pageable pageable);
    void deleteWithChild(String commentId);
}
