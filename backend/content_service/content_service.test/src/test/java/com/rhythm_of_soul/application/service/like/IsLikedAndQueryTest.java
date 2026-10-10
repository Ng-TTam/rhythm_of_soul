package com.rhythm_of_soul.application.service.like;

import com.rhythm_of_soul.application.service.Identity.IdentityClient;
import com.rhythm_of_soul.application.service.like.impl.LikeServiceImpl;
import com.rhythm_of_soul.application.service.publisher.RedisPublisher;
import com.rhythm_of_soul.domain.model.entity.Like;
import com.rhythm_of_soul.domain.repository.LikeRepository;
import com.rhythm_of_soul.domain.repository.PostRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IsLikedAndQueryTest {

    @Mock private LikeRepository likeRepository;
    @Mock private PostRepository postRepository;
    @Mock private RedisPublisher redisPublisher;
    @Mock private IdentityClient identityClient;

    @InjectMocks
    private LikeServiceImpl likeService;

    private static final String ACCOUNT_ID = "acc-1";
    private static final String POST_ID = "post-1";

    @Test
    @DisplayName("isLiked returns true when like exists")
    void isLiked_Exists_ReturnsTrue() {
        when(likeRepository.existsByAccountIdAndPostId(ACCOUNT_ID, POST_ID)).thenReturn(true);

        boolean result = likeService.isLiked(ACCOUNT_ID, POST_ID);

        assertTrue(result);
    }

    @Test
    @DisplayName("isLiked returns false when like does not exist")
    void isLiked_NotExists_ReturnsFalse() {
        when(likeRepository.existsByAccountIdAndPostId(ACCOUNT_ID, POST_ID)).thenReturn(false);

        boolean result = likeService.isLiked(ACCOUNT_ID, POST_ID);

        assertFalse(result);
    }

    @Test
    @DisplayName("countLikes returns 0 (not yet implemented)")
    void countLikes_ReturnsZero() {
        long result = likeService.countLikes(POST_ID);
        assertEquals(0, result);
    }

    @Test
    @DisplayName("getUserLikes returns list of accountIds")
    void getUserLikes_ReturnsList() {
        Like like1 = Like.builder().accountId("acc-1").postId(POST_ID).build();
        Like like2 = Like.builder().accountId("acc-2").postId(POST_ID).build();
        Page<Like> likePage = new PageImpl<>(List.of(like1, like2));

        when(likeRepository.findByPostId(eq(POST_ID), any(Pageable.class))).thenReturn(likePage);

        List<String> result = likeService.getUserLikes(POST_ID, 0, 10);

        assertEquals(2, result.size());
        assertTrue(result.contains("acc-1"));
        assertTrue(result.contains("acc-2"));
    }

    @Test
    @DisplayName("getUserLikes returns empty list when no likes")
    void getUserLikes_NoLikes_ReturnsEmpty() {
        Page<Like> emptyPage = new PageImpl<>(List.of());

        when(likeRepository.findByPostId(eq(POST_ID), any(Pageable.class))).thenReturn(emptyPage);

        List<String> result = likeService.getUserLikes(POST_ID, 0, 10);

        assertTrue(result.isEmpty());
    }
}
