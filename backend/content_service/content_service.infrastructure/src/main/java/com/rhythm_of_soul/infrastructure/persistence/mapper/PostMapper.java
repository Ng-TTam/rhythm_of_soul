package com.rhythm_of_soul.infrastructure.persistence.mapper;

import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.infrastructure.persistence.model.PostEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {

    Post toDomain(PostEntity postEntity);
}
