package com.rhythm_of_soul.infrastructure.persistence.mapper;

import com.rhythm_of_soul.domain.model.entity.Comment;
import com.rhythm_of_soul.infrastructure.persistence.model.CommentEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment toDomain(CommentEntity commentEntity);
}
