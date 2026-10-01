package com.rhythm_of_soul.infrastructure.persistence.repository;

import com.rhythm_of_soul.infrastructure.persistence.model.CommentEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentJpaRepository extends JpaRepository<CommentEntity, String> {
    List<CommentEntity> findByPostId(String postId);
    List<CommentEntity> findAllByPostId(String postId);
    List<CommentEntity> findByPostIdAndParentIdIsNullOrderByCreatedAtDesc(String postId, Pageable pageable);
    List<CommentEntity> findByParentIdOrderByCreatedAtAsc(String parentId, Pageable pageable);

    @Modifying
    @Query(value = """
        WITH RECURSIVE comment_tree AS (
            SELECT id
            FROM comments
            WHERE id = :id

            UNION ALL

            SELECT c.id
            FROM comments c
            JOIN comment_tree t
                ON c.parent_id = t.id
        )

        DELETE FROM comments
        WHERE id IN (
            SELECT id
            FROM comment_tree
        )
        """, nativeQuery = true)
    void deleteWithChild(String commentId);
}
