package com.rhythm_of_soul.application.mapper;

import com.rhythm_of_soul.application.model.request.PostRequest;
import com.rhythm_of_soul.application.model.response.PostResponse;
import com.rhythm_of_soul.domain.model.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(target = "content.songIds", ignore = true)
    PostResponse toPostResponse(Post post);

    Post toPost(PostRequest postRequest);
}
