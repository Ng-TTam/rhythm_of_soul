package com.rhythm_of_soul.application.service.like;

import com.rhythm_of_soul.application.model.request.LikeCommentRequest;
import com.rhythm_of_soul.application.model.response.UserBasicInfoResponse;
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
class LikePostTest {

    @Mock private LikeRepository likeRepository;
    @Mock private PostRepository postRepository;
    @Mock private RedisPublisher redisPublisher;
    @Mock private IdentityClient identityClient;

    @InjectMocks
    private LikeServiceImpl likeService;

    private static final String ACCOUNT_ID = "acc-1";
    private static final String POST_ID = "post-1";

    @Test
    @DisplayName("Like post successfully when not already liked")
    void like_Success() {
        Post post = Post.builder().id(POST_ID).accountId("author-1").likeCount(10).build();
        UserBasicInfoResponse userInfo = UserBasicInfoResponse.builder()
                .userId("user-1").name("User One").build();

        when(likeRepository.existsByAccountIdAndPostId(ACCOUNT_ID, POST_ID)).thenReturn(false);
        when(postRepository.findById(POST_ID)).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        doNothing().when(likeRepository).save(POST_ID, ACCOUNT_ID);
        when(identityClient.getUserInfoByAccountId(anyString())).thenReturn(userInfo);
        doNothing().when(redisPublisher).publishLikeCommentEvent(any(LikeCommentRequest.class));

        boolean result = likeService.like(ACCOUNT_ID, POST_ID);

        assertTrue(result);
        assertEquals(11, post.getLikeCount());
        verify(likeRepository).save(POST_ID, ACCOUNT_ID);
        verify(postRepository).save(post);
    }

    @Test
    @DisplayName("Like post returns false when already liked")
    void like_AlreadyLiked_ReturnsFalse() {
        when(likeRepository.existsByAccountIdAndPostId(ACCOUNT_ID, POST_ID)).thenReturn(true);

        boolean result = likeService.like(ACCOUNT_ID, POST_ID);

        assertFalse(result);
        verify(likeRepository, never()).save(anyString(), anyString());
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    @DisplayName("Like post increments likeCount from 0 to 1")
    void like_FromZero_IncrementsToOne() {
        Post post = Post.builder().id(POST_ID).accountId("author-1").likeCount(0).build();
        UserBasicInfoResponse userInfo = UserBasicInfoResponse.builder()
                .userId("user-1").name("User One").build();

        when(likeRepository.existsByAccountIdAndPostId(ACCOUNT_ID, POST_ID)).thenReturn(false);
        when(postRepository.findById(POST_ID)).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        doNothing().when(likeRepository).save(POST_ID, ACCOUNT_ID);
        when(identityClient.getUserInfoByAccountId(anyString())).thenReturn(userInfo);

        likeService.like(ACCOUNT_ID, POST_ID);

        assertEquals(1, post.getLikeCount());
    }

    @Test
    @DisplayName("Like post still succeeds even if Redis event fails")
    void like_RedisEventFails_StillReturnsTrue() {
        Post post = Post.builder().id(POST_ID).accountId("author-1").likeCount(5).build();

        when(likeRepository.existsByAccountIdAndPostId(ACCOUNT_ID, POST_ID)).thenReturn(false);
        when(postRepository.findById(POST_ID)).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        doNothing().when(likeRepository).save(POST_ID, ACCOUNT_ID);
        when(identityClient.getUserInfoByAccountId(anyString())).thenThrow(new RuntimeException("Redis down"));

        boolean result = likeService.like(ACCOUNT_ID, POST_ID);

        assertTrue(result);
        assertEquals(6, post.getLikeCount());
        verify(likeRepository).save(POST_ID, ACCOUNT_ID);
    }
}
