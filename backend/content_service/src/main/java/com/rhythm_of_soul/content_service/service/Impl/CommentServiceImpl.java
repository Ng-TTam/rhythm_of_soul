package com.rhythm_of_soul.content_service.service.Impl;

import com.rhythm_of_soul.content_service.dto.request.CommentCreationRequest;
import com.rhythm_of_soul.content_service.dto.request.CommentReportRequest;
import com.rhythm_of_soul.content_service.dto.request.CommentUpdateRequest;
import com.rhythm_of_soul.content_service.dto.response.CommentResponse;
import com.rhythm_of_soul.content_service.entity.Comment;
import com.rhythm_of_soul.content_service.entity.Post;
import com.rhythm_of_soul.content_service.exception.AppException;
import com.rhythm_of_soul.content_service.exception.ErrorCode;
import com.rhythm_of_soul.content_service.mapper.CommentMapper;
import com.rhythm_of_soul.content_service.repository.CommentRepository;
import com.rhythm_of_soul.content_service.repository.PostRepository;
import com.rhythm_of_soul.content_service.service.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CommentServiceImpl implements CommentService {
    PostRepository postRepository;
    CommentRepository commentRepository;
    CommentMapper commentMapper;

    @Override
    @Transactional
//    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    public CommentResponse createComment(CommentCreationRequest request) {
        Post post = postRepository.findById(request.getPostId()).orElseThrow(
                () -> new AppException(ErrorCode.POST_NOT_FOUND));
        if( request.getParentId() != null ) {
            commentRepository.findById(request.getParentId()).orElseThrow(
                    () -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        }
        // update comment count
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        Comment comment = commentMapper.toComment(request);
        // set accountId using accountId in token
//        comment.setAccountId(SecurityContextHolder.getContext().getAuthentication().getName());
        comment.setAccountId("326e6645-aa0f-4f89-b885-019c05b1a970");
        comment.setCreatedAt(Instant.now());
        comment.setUpdatedAt(Instant.now());

        return commentMapper.toCommentResponse(commentRepository.save(comment));
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
//    @PreAuthorize("commentSecurity.isCommentOwner(commentId)")
    public CommentResponse updateComment(String commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(commentId).orElseThrow();

        commentMapper.updateComment(comment, request);
        comment.setUpdatedAt(Instant.now());
        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }

    @Override
//    @PreAuthorize("commentSecurity.isCommentOwner(commentId) or hasRole('ADMIN')")
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
