package com.rhythm_of_soul.application.service.like;

import com.rhythm_of_soul.application.service.Identity.IdentityClient;
import com.rhythm_of_soul.application.service.like.impl.LikeServiceImpl;
import com.rhythm_of_soul.application.service.publisher.RedisPublisher;
import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.repository.LikeRepository;
import com.rhythm_of_soul.domain.repository.PostRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UnlikePostTest {

    @Mock private LikeRepository likeRepository;
    @Mock private PostRepository postRepository;
    @Mock private RedisPublisher redisPublisher;
    @Mock private IdentityClient identityClient;

    @InjectMocks
    private LikeServiceImpl likeService;

    private static final String ACCOUNT_ID = "acc-1";
    private static final String POST_ID = "post-1";

    @Test
    @DisplayName("Unlike post successfully when already liked")
    void unlike_Success() {
        Post post = Post.builder().id(POST_ID).likeCount(10).build();

        when(likeRepository.existsByAccountIdAndPostId(ACCOUNT_ID, POST_ID)).thenReturn(true);
        when(postRepository.findById(POST_ID)).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        doNothing().when(likeRepository).deleteByAccountIdAndPostId(ACCOUNT_ID, POST_ID);

        boolean result = likeService.unlike(ACCOUNT_ID, POST_ID);

        assertTrue(result);
        assertEquals(9, post.getLikeCount());
        verify(likeRepository).deleteByAccountIdAndPostId(ACCOUNT_ID, POST_ID);
        verify(postRepository).save(post);
    }

    @Test
    @DisplayName("Unlike post returns false when not yet liked")
    void unlike_NotLiked_ReturnsFalse() {
        when(likeRepository.existsByAccountIdAndPostId(ACCOUNT_ID, POST_ID)).thenReturn(false);

        boolean result = likeService.unlike(ACCOUNT_ID, POST_ID);

        assertFalse(result);
        verify(likeRepository, never()).deleteByAccountIdAndPostId(anyString(), anyString());
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    @DisplayName("Unlike post decrements likeCount from 1 to 0")
    void unlike_FromOne_DecrementsToZero() {
        Post post = Post.builder().id(POST_ID).likeCount(1).build();

        when(likeRepository.existsByAccountIdAndPostId(ACCOUNT_ID, POST_ID)).thenReturn(true);
        when(postRepository.findById(POST_ID)).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        doNothing().when(likeRepository).deleteByAccountIdAndPostId(ACCOUNT_ID, POST_ID);

        likeService.unlike(ACCOUNT_ID, POST_ID);

        assertEquals(0, post.getLikeCount());
    }
}
