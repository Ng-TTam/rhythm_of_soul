package com.rhythm_of_soul.identity_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.rhythm_of_soul.identity_service.dto.request.ArtistProfileRequest;
import com.rhythm_of_soul.identity_service.entity.ArtistProfile;

@Mapper(componentModel = "spring")
public interface ArtistProfileMapper {

    ArtistProfile toArtistProfile(ArtistProfileRequest artistProfileRequest);

    void updateArtistProfile(@MappingTarget ArtistProfile artistProfile, ArtistProfileRequest artistProfileRequest);
}
