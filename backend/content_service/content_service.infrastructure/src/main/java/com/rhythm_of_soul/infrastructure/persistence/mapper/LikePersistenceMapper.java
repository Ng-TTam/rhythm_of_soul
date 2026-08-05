package com.rhythm_of_soul.infrastructure.persistence.mapper;

import com.rhythm_of_soul.domain.model.entity.Like;
import com.rhythm_of_soul.infrastructure.persistence.model.LikeEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LikePersistenceMapper {
    Like toDomain(LikeEntity likeEntity);
}
