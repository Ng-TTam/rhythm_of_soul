package com.rhythm_of_soul.identity_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.rhythm_of_soul.identity_service.dto.request.UserUpdateRequest;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;
import com.rhythm_of_soul.identity_service.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserUpdateRequest userUpdateRequest);

    @Mapping(source = "artist", target = "isArtist")
    UserResponse toUserResponse(User user);

    @Mapping(target = "artistProfile", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest userUpdateRequest);

    void updateArtist(@MappingTarget User user, UserUpdateRequest userUpdateRequest);
}
