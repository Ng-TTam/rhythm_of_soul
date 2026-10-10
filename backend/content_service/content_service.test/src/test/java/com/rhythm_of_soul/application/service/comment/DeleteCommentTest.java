package com.rhythm_of_soul.application.service.comment;

import com.rhythm_of_soul.application.mapper.CommentMapper;
import com.rhythm_of_soul.application.service.Identity.IdentityClient;
import com.rhythm_of_soul.application.service.comment.impl.CommentServiceImpl;
import com.rhythm_of_soul.application.service.publisher.RedisPublisher;
import com.rhythm_of_soul.domain.model.entity.Comment;
import com.rhythm_of_soul.domain.repository.CommentRepository;
import com.rhythm_of_soul.domain.repository.PostRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeleteCommentTest {

    @Mock private PostRepository postRepository;
    @Mock private CommentRepository commentRepository;
    @Mock private IdentityClient identityClient;
    @Mock private RedisPublisher redisPublisher;
    @Mock private CommentMapper commentMapper;

    @InjectMocks
    private CommentServiceImpl commentService;

    @Test
    @DisplayName("Delete comment successfully removes comment and children")
    void deleteComment_Success() {
        String commentId = "cmt-1";
        Comment existingComment = Comment.builder().id(commentId).build();

        when(commentRepository.findById(commentId)).thenReturn(existingComment);
        doNothing().when(commentRepository).deleteById(commentId);
        doNothing().when(commentRepository).deleteWithChild(commentId);

        commentService.deleteComment(commentId);

        verify(commentRepository).findById(commentId);
        verify(commentRepository).deleteById(commentId);
        verify(commentRepository).deleteWithChild(commentId);
    }

    @Test
    @DisplayName("Delete comment calls deleteWithChild to cascade delete replies")
    void deleteComment_CascadesChildDeletion() {
        String parentCommentId = "cmt-parent";
        Comment parentComment = Comment.builder().id(parentCommentId).postId("post-1").build();

        when(commentRepository.findById(parentCommentId)).thenReturn(parentComment);
        doNothing().when(commentRepository).deleteById(parentCommentId);
        doNothing().when(commentRepository).deleteWithChild(parentCommentId);

        commentService.deleteComment(parentCommentId);

        verify(commentRepository).deleteWithChild(parentCommentId);
    }
}
