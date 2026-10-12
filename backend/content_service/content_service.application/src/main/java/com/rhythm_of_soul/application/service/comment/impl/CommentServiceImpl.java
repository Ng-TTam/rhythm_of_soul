package com.rhythm_of_soul.application.service.comment.impl;

import com.rhythm_of_soul.application.mapper.CommentMapper;
import com.rhythm_of_soul.application.model.request.CommentCreationRequest;
import com.rhythm_of_soul.application.model.request.CommentReportRequest;
import com.rhythm_of_soul.application.model.request.CommentUpdateRequest;
import com.rhythm_of_soul.application.model.request.LikeCommentRequest;
import com.rhythm_of_soul.application.model.response.CommentResponse;
import com.rhythm_of_soul.application.service.Identity.IdentityClient;
import com.rhythm_of_soul.application.service.comment.CommentService;
import com.rhythm_of_soul.application.service.publisher.NotificationEventPublisher;
import com.rhythm_of_soul.domain.model.entity.Comment;
import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import com.rhythm_of_soul.domain.repository.CommentRepository;
import com.rhythm_of_soul.domain.repository.PostRepository;
import com.rhythm_of_soul.infrastructure.utils.SecurityUtils;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final IdentityClient identityClient;
    private final NotificationEventPublisher notificationEventPublisher;
    private final CommentMapper commentMapper;

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    @RateLimiter(name = "identity")
    public CommentResponse createComment(CommentCreationRequest request) {
        Post post = postRepository.findById(request.getPostId());

        if (request.getParentId() != null && !request.getParentId().trim().isEmpty()) {
            Comment parentComment = commentRepository.findById(request.getParentId());
            if (!parentComment.getPostId().equals(request.getPostId())) {
                throw new AppException(ErrorCode.COMMENT_NOT_FOUND);
            }
        }

        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        Comment comment = commentMapper.toComment(request);
        comment.setAccountId(SecurityUtils.getCurrentAccountId());
        comment.setUserIsArtist("ROLE_ARTIST".equals(SecurityUtils.getRoleFromToken()));
        Instant now = Instant.now();
        comment.setCreatedAt(now);
        comment.setUpdatedAt(now);

        Comment saved = commentRepository.save(comment);

        // Send comment event vào RabbitMQ Notification Queue
        try {
            LikeCommentRequest event = new LikeCommentRequest();
            event.setAuthorId(identityClient.getUserInfoByAccountId(comment.getAccountId()).getUserId());             // người bình luận
            event.setAuthorName(identityClient.getUserInfoByAccountId(comment.getAccountId()).getName());          // tên người bình luận
            event.setReferenceId(comment.getPostId());
            event.setPostAuthorId(identityClient.getUserInfoByAccountId(post.getAccountId()).getUserId());            // chủ bài viết
            event.setType("COMMENT");

            notificationEventPublisher.publishNotificationEvent(event);
        } catch (Exception e) {
            log.error("Failed to publish notification event", e);
        }

        return new CommentResponse();
    }

    @Override
    public List<CommentResponse> getTopLevelComments(String postId, int page, int size) {
        List<Comment> comments = commentRepository
                .findByPostIdAndParentIdIsNullOrderByCreatedAtDesc(postId, PageRequest.of(page, size));
        return comments.stream()
                .map(comment -> {
                    CommentResponse res = commentMapper.toCommentResponse(comment);
                    List<Comment> children = commentRepository
                            .findByParentIdOrderByCreatedAtAsc(comment.getId(), PageRequest.of(0, 3));
                    res.setChild_comments(children.stream()
                            .map(commentMapper::toCommentResponse)
                            .collect(Collectors.toList()));
                    return res;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentResponse> getReplies(String parentCommentId, int page, int size) {
        List<Comment> replies = commentRepository.findByParentIdOrderByCreatedAtAsc(
                parentCommentId, PageRequest.of(page, size)
        );
        return replies.stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("commentSecurity.isCommentOwner(commentId)")
    public CommentResponse updateComment(String commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(commentId);

        commentMapper.updateComment(comment, request);
        comment.setUpdatedAt(Instant.now());
        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }

    @Override
    @Transactional
    @PreAuthorize("commentSecurity.isCommentOwner(commentId) or hasRole('ADMIN')")
    public void deleteComment(String commentId) {
        commentRepository.findById(commentId);
        commentRepository.deleteById(commentId);
        commentRepository.deleteWithChild(commentId);
    }

    @Override
    public long countCommentsByPost(String postId) {
        return 0;
    }

    @Override
    public void reportComment(String commentId, String accountId, CommentReportRequest request) {

    }
}
