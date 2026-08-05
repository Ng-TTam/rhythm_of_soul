package com.rhythm_of_soul.infrastructure.utils;


import com.rhythm_of_soul.domain.model.entity.Comment;
import com.rhythm_of_soul.domain.repository.CommentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("commentSecurity")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentSecurity {
    CommentRepository commentRepository;

    public boolean isCommentOwner(String commentId) {
        Comment comment = commentRepository.findById(commentId);
        // contain in context is accountId not accountId
        var accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        return accountId.equals(comment.getAccountId());
    }
}
