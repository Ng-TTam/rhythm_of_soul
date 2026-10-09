package com.rhythm_of_soul.application.service.comment;

import com.rhythm_of_soul.application.mapper.CommentMapper;
import com.rhythm_of_soul.application.model.request.CommentCreationRequest;
import com.rhythm_of_soul.application.model.response.CommentResponse;
import com.rhythm_of_soul.application.service.Identity.IdentityClient;
import com.rhythm_of_soul.application.service.comment.impl.CommentServiceImpl;
import com.rhythm_of_soul.application.service.publisher.NotificationEventPublisher;
import com.rhythm_of_soul.domain.model.entity.Comment;
import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.repository.CommentRepository;
import com.rhythm_of_soul.domain.repository.PostRepository;
import com.rhythm_of_soul.infrastructure.utils.SecurityUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateCommentTest {

    @Mock private PostRepository postRepository;
    @Mock private CommentRepository commentRepository;
    @Mock private IdentityClient identityClient;
    @Mock private NotificationEventPublisher notificationEventPublisher;
    @Mock private CommentMapper commentMapper;

    @InjectMocks
    private CommentServiceImpl commentService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        lenient().when(commentMapper.toComment(any(CommentCreationRequest.class))).thenAnswer(invocation -> {
            CommentCreationRequest r = invocation.getArgument(0);
            return Comment.builder()
                    .postId(r.getPostId())
                    .content(r.getContent())
                    .parentId(r.getParentId())
                    .username(r.getUsername())
                    .userAvatar(r.getUserAvatar())
                    .build();
        });
    }

    @Test
    @DisplayName("Create top-level comment successfully")
    void createComment_TopLevel_Success() {
        CommentCreationRequest req = CommentCreationRequest.builder()
                .postId("post-1")
                .content("Nice post!")
                .username("user1")
                .userAvatar("avatar.jpg")
                .build();

        Post post = Post.builder().id("post-1").commentCount(0).build();
        Comment savedComment = Comment.builder().id("cmt-1").postId("post-1").content("Nice post!").build();

        when(postRepository.findById("post-1")).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        when(commentRepository.save(any(Comment.class))).thenReturn(savedComment);

        try (MockedStatic<SecurityUtils> securityMock = mockStatic(SecurityUtils.class)) {
            securityMock.when(SecurityUtils::getCurrentAccountId).thenReturn("acc-1");
            securityMock.when(SecurityUtils::getRoleFromToken).thenReturn("ROLE_USER");

            CommentResponse result = commentService.createComment(req);

            assertNotNull(result);
            assertEquals(1, post.getCommentCount());
            verify(postRepository).save(any(Post.class));
            verify(commentRepository).save(any(Comment.class));
        }
    }

    @Test
    @DisplayName("Create reply comment successfully")
    void createComment_Reply_Success() {
        CommentCreationRequest req = CommentCreationRequest.builder()
                .postId("post-1")
                .content("Great reply!")
                .username("user2")
                .parentId("cmt-parent")
                .build();

        Post post = Post.builder().id("post-1").commentCount(5).build();
        Comment parentComment = Comment.builder().id("cmt-parent").postId("post-1").build();
        Comment savedReply = Comment.builder().id("cmt-2").postId("post-1").parentId("cmt-parent").build();

        when(postRepository.findById("post-1")).thenReturn(post);
        when(commentRepository.findById("cmt-parent")).thenReturn(parentComment);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        when(commentRepository.save(any(Comment.class))).thenReturn(savedReply);

        try (MockedStatic<SecurityUtils> securityMock = mockStatic(SecurityUtils.class)) {
            securityMock.when(SecurityUtils::getCurrentAccountId).thenReturn("acc-2");
            securityMock.when(SecurityUtils::getRoleFromToken).thenReturn("ROLE_USER");

            CommentResponse result = commentService.createComment(req);

            assertNotNull(result);
            assertEquals(6, post.getCommentCount());
            verify(commentRepository).save(any(Comment.class));
        }
    }

    @Test
    @DisplayName("Create comment by ARTIST sets userIsArtist to true")
    void createComment_ByArtist_SetsIsArtistTrue() {
        CommentCreationRequest req = CommentCreationRequest.builder()
                .postId("post-1")
                .content("Artist comment")
                .username("artistUser")
                .build();

        Post post = Post.builder().id("post-1").commentCount(0).build();

        when(postRepository.findById("post-1")).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment c = invocation.getArgument(0);
            assertTrue(c.isUserIsArtist(), "Comment should have userIsArtist=true for ARTIST role");
            return c;
        });

        try (MockedStatic<SecurityUtils> securityMock = mockStatic(SecurityUtils.class)) {
            securityMock.when(SecurityUtils::getCurrentAccountId).thenReturn("acc-artist");
            securityMock.when(SecurityUtils::getRoleFromToken).thenReturn("ROLE_ARTIST");

            commentService.createComment(req);

            verify(commentRepository).save(any(Comment.class));
        }
    }

    @Test
    @DisplayName("Create comment with blank content should still process (validation is at controller level)")
    void createComment_BlankContent_StillProcesses() {
        CommentCreationRequest req = CommentCreationRequest.builder()
                .postId("post-1")
                .content("")
                .username("user1")
                .build();

        Post post = Post.builder().id("post-1").commentCount(0).build();

        when(postRepository.findById("post-1")).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        try (MockedStatic<SecurityUtils> securityMock = mockStatic(SecurityUtils.class)) {
            securityMock.when(SecurityUtils::getCurrentAccountId).thenReturn("acc-1");
            securityMock.when(SecurityUtils::getRoleFromToken).thenReturn("ROLE_USER");

            CommentResponse result = commentService.createComment(req);

            assertNotNull(result);
            verify(commentRepository).save(any(Comment.class));
        }
    }

    @Test
    @DisplayName("Create reply with invalid parent comment throws Exception")
    void createComment_Reply_InvalidParent_ThrowsException() {
        CommentCreationRequest req = CommentCreationRequest.builder()
                .postId("post-1")
                .content("Great reply!")
                .username("user2")
                .parentId("cmt-parent")
                .build();

        Post post = Post.builder().id("post-1").commentCount(5).build();
        Comment parentComment = Comment.builder().id("cmt-parent").postId("post-2").build(); // Different post ID

        when(postRepository.findById("post-1")).thenReturn(post);
        when(commentRepository.findById("cmt-parent")).thenReturn(parentComment);

        assertThrows(com.rhythm_of_soul.domain.model.exception.AppException.class, () -> commentService.createComment(req));
    }
}

