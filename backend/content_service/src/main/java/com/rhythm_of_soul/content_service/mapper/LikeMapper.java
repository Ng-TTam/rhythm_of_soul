package com.rhythm_of_soul.content_service.mapper;

import com.rhythm_of_soul.content_service.dto.response.LikeResponse;
import com.rhythm_of_soul.content_service.entity.Like;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LikeMapper {
    default LikeResponse toLikeResponse(Like like) {
        return LikeResponse.builder()
                .id(like.getId())
                .userId(like.getUserId())
                .build();
    }
}
