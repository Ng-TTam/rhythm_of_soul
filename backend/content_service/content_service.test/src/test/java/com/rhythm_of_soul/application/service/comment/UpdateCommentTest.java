package com.rhythm_of_soul.application.service.comment;

import com.rhythm_of_soul.application.mapper.CommentMapper;
import com.rhythm_of_soul.application.model.request.CommentUpdateRequest;
import com.rhythm_of_soul.application.model.response.CommentResponse;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UpdateCommentTest {

    @Mock private PostRepository postRepository;
    @Mock private CommentRepository commentRepository;
    @Mock private IdentityClient identityClient;
    @Mock private RedisPublisher redisPublisher;
    @Mock private CommentMapper commentMapper;

    @InjectMocks
    private CommentServiceImpl commentService;

    @Test
    @DisplayName("Update comment successfully")
    void updateComment_Success() {
        String commentId = "cmt-1";
        CommentUpdateRequest req = CommentUpdateRequest.builder().content("Updated!").build();
        Comment existingComment = Comment.builder().id(commentId).content("Old text").build();
        Comment savedComment = Comment.builder().id(commentId).content("Updated!").build();
        CommentResponse resp = CommentResponse.builder().id(commentId).content("Updated!").build();

        when(commentRepository.findById(commentId)).thenReturn(existingComment);
        doNothing().when(commentMapper).updateComment(existingComment, req);
        when(commentRepository.save(existingComment)).thenReturn(savedComment);
        when(commentMapper.toCommentResponse(savedComment)).thenReturn(resp);

        CommentResponse result = commentService.updateComment(commentId, req);

        assertNotNull(result);
        assertEquals("Updated!", result.getContent());
        verify(commentRepository).save(existingComment);
        verify(commentMapper).updateComment(existingComment, req);
    }

    @Test
    @DisplayName("Update comment sets updatedAt timestamp")
    void updateComment_SetsUpdatedAt() {
        String commentId = "cmt-2";
        CommentUpdateRequest req = CommentUpdateRequest.builder().content("New content").build();
        Comment existingComment = Comment.builder().id(commentId).content("Old").build();
        CommentResponse resp = CommentResponse.builder().id(commentId).content("New content").build();

        when(commentRepository.findById(commentId)).thenReturn(existingComment);
        doNothing().when(commentMapper).updateComment(existingComment, req);
        when(commentRepository.save(existingComment)).thenReturn(existingComment);
        when(commentMapper.toCommentResponse(existingComment)).thenReturn(resp);

        commentService.updateComment(commentId, req);

        assertNotNull(existingComment.getUpdatedAt(), "updatedAt should be set after update");
        verify(commentRepository).save(existingComment);
    }
}
