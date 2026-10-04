package com.rhythm_of_soul.application.service.post;

import com.rhythm_of_soul.application.factory.PostContentFactory;
import com.rhythm_of_soul.application.factory.strategy.PostContentStrategy;
import com.rhythm_of_soul.application.mapper.PostMapper;
import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.request.PostRequest;
import com.rhythm_of_soul.application.model.response.PostResponse;
import com.rhythm_of_soul.application.service.Identity.IdentityClient;
import com.rhythm_of_soul.application.service.post.impl.PostServiceImpl;
import com.rhythm_of_soul.application.service.publisher.RedisPublisher;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.repository.PostRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreatePostTest {

    @Mock private PostRepository postRepository;
    @Mock private PostMapper postMapper;
    @Mock private IdentityClient identityClient;
    @Mock private RedisPublisher redisPublisher;
    @Mock private PostContentFactory postContentFactory;
    @Mock private PostContentStrategy postContentStrategy;

    @InjectMocks
    private PostServiceImpl postService;

    private static final String ACCOUNT_ID = "acc-123";

    @Test
    @DisplayName("Create TEXT post successfully")
    void createPost_Text_Success() {
        PostRequest req = PostRequest.builder().type(Type.TEXT).caption("Hello DDD").build();
        Post mappedPost = Post.builder().type(Type.TEXT).build();
        PostResponse postResp = PostResponse.builder().type(Type.TEXT.name()).build();

        when(postMapper.toPost(req)).thenReturn(mappedPost);
        when(postContentFactory.getStrategy(Type.TEXT)).thenReturn(postContentStrategy);
        doNothing().when(postContentStrategy).validate(any());
        when(postContentStrategy.createContent(any())).thenReturn(null);
        when(postRepository.save(any(Post.class))).thenReturn(mappedPost);
        when(postMapper.toPostResponse(any(Post.class))).thenReturn(postResp);
        when(identityClient.getFollowerIds(ACCOUNT_ID)).thenReturn(Collections.emptyList());

        PostResponse result = postService.createPost(ACCOUNT_ID, req);

        assertNotNull(result);
        assertEquals("TEXT", result.getType());
        verify(postRepository).save(any(Post.class));
        verify(postContentStrategy).validate(any());
    }

    @Test
    @DisplayName("Create SONG post successfully")
    void createPost_Song_Success() {
        ContentRequest contentReq = ContentRequest.builder()
                .title("Hit Song").mediaUrl("song.mp3").build();
        PostRequest req = PostRequest.builder().type(Type.SONG).content(contentReq).build();
        Post mappedPost = Post.builder().type(Type.SONG).build();
        PostResponse postResp = PostResponse.builder().type(Type.SONG.name()).build();

        when(postMapper.toPost(req)).thenReturn(mappedPost);
        when(postContentFactory.getStrategy(Type.SONG)).thenReturn(postContentStrategy);
        doNothing().when(postContentStrategy).validate(any());
        when(postContentStrategy.createContent(any())).thenReturn(Content.builder().title("Hit Song").build());
        when(postRepository.save(any(Post.class))).thenReturn(mappedPost);
        when(postMapper.toPostResponse(any(Post.class))).thenReturn(postResp);
        when(identityClient.getFollowerIds(ACCOUNT_ID)).thenReturn(Collections.emptyList());

        PostResponse result = postService.createPost(ACCOUNT_ID, req);

        assertNotNull(result);
        assertEquals("SONG", result.getType());
        verify(postRepository).save(any(Post.class));
    }

    @Test
    @DisplayName("Cross-type Mismatch: Type is SONG but data is TEXT -> Throws Exception from Strategy")
    void createPost_TypeSong_DataText_ThrowsException() {
        // Data has no title/mediaUrl like a TEXT post
        ContentRequest contentReq = ContentRequest.builder().build();
        PostRequest req = PostRequest.builder().type(Type.SONG).caption("Text data").content(contentReq).build();
        Post mappedPost = Post.builder().type(Type.SONG).build();

        when(postMapper.toPost(req)).thenReturn(mappedPost);
        when(postContentFactory.getStrategy(Type.SONG)).thenReturn(postContentStrategy);
        
        // Mock the strategy throwing an exception when validating the bad data
        doThrow(new RuntimeException("Media URL must not be blank when type is SONG"))
                .when(postContentStrategy).validate(any());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.createPost(ACCOUNT_ID, req);
        });

        assertEquals("Media URL must not be blank when type is SONG", exception.getMessage());
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    @DisplayName("Cross-type Mismatch: Type is ALBUM but data is SONG -> Throws Exception")
    void createPost_TypeAlbum_DataSong_ThrowsException() {
        // Data has mediaUrl (like a SONG) but misses songIds (required for ALBUM)
        ContentRequest contentReq = ContentRequest.builder().mediaUrl("song.mp3").build();
        PostRequest req = PostRequest.builder().type(Type.ALBUM).content(contentReq).build();
        Post mappedPost = Post.builder().type(Type.ALBUM).build();

        when(postMapper.toPost(req)).thenReturn(mappedPost);
        when(postContentFactory.getStrategy(Type.ALBUM)).thenReturn(postContentStrategy);
        
        doThrow(new RuntimeException("Song IDs must not be empty for ALBUM"))
                .when(postContentStrategy).validate(any());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.createPost(ACCOUNT_ID, req);
        });

        assertEquals("Song IDs must not be empty for ALBUM", exception.getMessage());
        verify(postRepository, never()).save(any(Post.class));
    }
}
