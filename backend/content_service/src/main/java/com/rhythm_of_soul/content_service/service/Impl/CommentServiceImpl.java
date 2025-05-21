package com.rhythm_of_soul.content_service.service.Impl;

import com.rhythm_of_soul.content_service.dto.request.CommentCreationRequest;
import com.rhythm_of_soul.content_service.dto.request.CommentReportRequest;
import com.rhythm_of_soul.content_service.dto.request.CommentUpdateRequest;
import com.rhythm_of_soul.content_service.dto.request.LikeCommentRequest;
import com.rhythm_of_soul.content_service.dto.response.CommentResponse;
import com.rhythm_of_soul.content_service.entity.Comment;
import com.rhythm_of_soul.content_service.entity.Post;
import com.rhythm_of_soul.content_service.exception.AppException;
import com.rhythm_of_soul.content_service.exception.ErrorCode;
import com.rhythm_of_soul.content_service.mapper.CommentMapper;
import com.rhythm_of_soul.content_service.repository.CommentRepository;
import com.rhythm_of_soul.content_service.repository.PostRepository;
import com.rhythm_of_soul.content_service.service.CommentService;
import com.rhythm_of_soul.content_service.service.IdentityClient;
import com.rhythm_of_soul.content_service.service.RedisPublisher;
import com.rhythm_of_soul.content_service.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CommentServiceImpl implements CommentService {
    PostRepository postRepository;
    CommentRepository commentRepository;
    CommentMapper commentMapper;
    RedisPublisher redisPublisher;
    IdentityClient identityClient;

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    public CommentResponse createComment(CommentCreationRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (request.getParentId() != null) {
            commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
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

        // ✅ Gửi sự kiện comment vào Redis Stream
        try {
            LikeCommentRequest event = new LikeCommentRequest();
            event.setAuthorId(identityClient.getUserInfoByAccountId(comment.getAccountId()).getUserId());             // người bình luận
            event.setAuthorName(identityClient.getUserInfoByAccountId(comment.getAccountId()).getName());          // tên người bình luận
            event.setReferenceId(comment.getPostId());             // ID bài viết
            event.setPostAuthorId(identityClient.getUserInfoByAccountId(post.getAccountId()).getUserId());            // chủ bài viết
            event.setType("COMMENT");

            redisPublisher.publishLikeCommentEvent(event);
            log.info("push message successfully");
        } catch (Exception e) {
            // Log lỗi nếu không gửi được
            e.printStackTrace();
        }

        return commentMapper.toCommentResponse(saved);
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
        Comment comment = commentRepository.findById(commentId).orElseThrow();

        commentMapper.updateComment(comment, request);
        comment.setUpdatedAt(Instant.now());
        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }

    @Override
    @PreAuthorize("commentSecurity.isCommentOwner(commentId) or hasRole('ADMIN')")
    public void deleteComment(String commentId) {
        commentRepository.findById(commentId).orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        commentRepository.deleteById(commentId);
        commentRepository.deleteByParentId(commentId);
    }

    @Override
    public long countCommentsByPost(String postId) {
        return 0;
    }

    @Override
    public void reportComment(String commentId, String accountId, CommentReportRequest request) {

    }
}
