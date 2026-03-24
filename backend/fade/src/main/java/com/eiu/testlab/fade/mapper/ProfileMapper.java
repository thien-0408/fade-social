package com.eiu.testlab.fade.mapper;

import com.eiu.testlab.fade.dto.ProfileCreationRequest;
import com.eiu.testlab.fade.dto.ProfileResponse;
import com.eiu.testlab.fade.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "coverImageUrl", ignore = true)
    Profile toEntity(ProfileCreationRequest request);
    ProfileResponse toResponse(Profile response);
}
