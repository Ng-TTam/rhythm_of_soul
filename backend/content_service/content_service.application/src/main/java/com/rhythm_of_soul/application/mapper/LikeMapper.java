package com.rhythm_of_soul.application.mapper;

import com.rhythm_of_soul.application.model.response.LikeResponse;
import com.rhythm_of_soul.domain.model.entity.Like;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LikeMapper {
    LikeResponse toLikeResponse(Like like);
}
