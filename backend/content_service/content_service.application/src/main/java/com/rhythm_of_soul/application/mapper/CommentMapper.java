package com.rhythm_of_soul.application.mapper;

import com.rhythm_of_soul.application.model.request.CommentCreationRequest;
import com.rhythm_of_soul.application.model.request.CommentUpdateRequest;
import com.rhythm_of_soul.application.model.response.CommentResponse;
import com.rhythm_of_soul.domain.model.entity.Comment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentResponse toCommentResponse(Comment comment);

    Comment toComment(CommentCreationRequest request);

    void updateComment(Comment comment, CommentUpdateRequest request);
}