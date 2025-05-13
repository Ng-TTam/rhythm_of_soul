//package com.rhythm_of_soul.content_service.utils;
//
//import com.rhythm_of_soul.content_service.entity.Comment;
//import com.rhythm_of_soul.content_service.exception.AppException;
//import com.rhythm_of_soul.content_service.exception.ErrorCode;
//import com.rhythm_of_soul.content_service.repository.CommentRepository;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//
//@Component("commentSecurity")
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//public class CommentSecurity {
//
//    CommentRepository commentRepository;
//
//    public boolean isCommentOwner(String commentId) {
//        Comment comment = commentRepository.findById(commentId)
//                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
//
//        // contain in context is accountId not accountId
//        var accountId = SecurityContextHolder.getContext().getAuthentication().getName();
//        return accountId.equals(comment.getAccountId());
//    }
//}
