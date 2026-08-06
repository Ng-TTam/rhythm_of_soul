package com.rhythm_of_soul.application.mapper;

import com.rhythm_of_soul.application.model.request.PostRequest;
import com.rhythm_of_soul.application.model.response.PostResponse;
import com.rhythm_of_soul.domain.model.entity.Post;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostResponse toPostResponse(Post post);
    Post toPost(PostRequest postRequest);
}
