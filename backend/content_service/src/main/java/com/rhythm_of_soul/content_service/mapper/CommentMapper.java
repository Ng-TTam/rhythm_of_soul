package com.rhythm_of_soul.content_service.mapper;

import com.rhythm_of_soul.content_service.dto.request.CommentCreationRequest;
import com.rhythm_of_soul.content_service.dto.request.CommentUpdateRequest;
import com.rhythm_of_soul.content_service.dto.response.CommentResponse;
import com.rhythm_of_soul.content_service.entity.Comment;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    CommentResponse toCommentResponse(Comment comment);
    @AfterMapping
    default void setDefaults(@MappingTarget CommentResponse response) {
        if (response.getUsername() == null) {
            response.setUsername("User");
        }
        if (response.getUserAvatar() == null) {
            response.setUserAvatar("/assets/images/default/avatar.jpg");
        }
    }
    Comment toComment(CommentCreationRequest request);

    void updateComment(@MappingTarget Comment comment, CommentUpdateRequest request);
}
