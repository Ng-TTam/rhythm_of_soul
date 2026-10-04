package com.rhythm_of_soul.application.service.post;

import com.rhythm_of_soul.application.factory.PostContentFactory;
import com.rhythm_of_soul.application.factory.strategy.PostContentStrategy;
import com.rhythm_of_soul.application.mapper.PostMapper;
import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.request.PostRequest;
import com.rhythm_of_soul.application.model.response.PostResponse;
import com.rhythm_of_soul.application.service.post.impl.PostServiceImpl;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import com.rhythm_of_soul.domain.repository.PostRepository;
import com.rhythm_of_soul.domain.repository.LikeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UpdatePostTest {

    @Mock private PostRepository postRepository;
    @Mock private LikeRepository likeRepository;
    @Mock private PostMapper postMapper;
    @Mock private PostContentFactory postContentFactory;
    @Mock private PostContentStrategy postContentStrategy;

    @InjectMocks
    private PostServiceImpl postService;

    private static final String POST_ID = "post-123";

    @Test
    @DisplayName("Update post successfully")
    void updatePost_Success() {
        PostRequest req = PostRequest.builder().type(Type.TEXT).caption("Updated text").build();
        Post existingPost = Post.builder().id(POST_ID).type(Type.TEXT).caption("Old text").build();
        PostResponse postResp = PostResponse.builder().id(POST_ID).type(Type.TEXT.name()).caption("Updated text").build();

        when(postRepository.findById(POST_ID)).thenReturn(existingPost);
        when(postContentFactory.getStrategy(Type.TEXT)).thenReturn(postContentStrategy);
        doNothing().when(postContentStrategy).validate(any());
        
        when(postRepository.save(any(Post.class))).thenReturn(existingPost);
        when(postMapper.toPostResponse(any(Post.class))).thenReturn(postResp);

        PostResponse result = postService.updatePost(POST_ID, req);

        assertNotNull(result);
        assertEquals("Updated text", result.getCaption());
        verify(postRepository).save(any(Post.class));
    }

    @Test
    @DisplayName("Update post throws POST_NOT_FOUND when post does not exist")
    void updatePost_NotFound_ThrowsException() {
        PostRequest req = PostRequest.builder().type(Type.TEXT).build();
        when(postRepository.findById(POST_ID)).thenReturn(null);

        AppException exception = assertThrows(AppException.class, () -> {
            postService.updatePost(POST_ID, req);
        });

        assertEquals(ErrorCode.POST_NOT_FOUND, exception.getErrorCode());
        verify(postRepository, never()).save(any(Post.class));
    }
    
    @Test
    @DisplayName("Cross-type Mismatch in Update: Try to update a SONG but pass TEXT data")
    void updatePost_CrossTypeMismatch_ThrowsException() {
        // Assume trying to update a SONG, but forgot to include mediaUrl
        PostRequest req = PostRequest.builder().type(Type.SONG).content(ContentRequest.builder().build()).build();
        Post existingPost = Post.builder().id(POST_ID).type(Type.SONG).build();
        
        when(postRepository.findById(POST_ID)).thenReturn(existingPost);
        when(postContentFactory.getStrategy(Type.SONG)).thenReturn(postContentStrategy);
        doThrow(new RuntimeException("Media URL missing")).when(postContentStrategy).validate(any());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.updatePost(POST_ID, req);
        });

        assertEquals("Media URL missing", exception.getMessage());
        verify(postRepository, never()).save(any(Post.class));
    }
}
