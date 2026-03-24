package com.eiu.testlab.fade.mapper;

import com.eiu.testlab.fade.dto.RegisterDto;
import com.eiu.testlab.fade.dto.UserResponse;
import com.eiu.testlab.fade.entity.Profile;
import com.eiu.testlab.fade.entity.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {Profile.class})
public interface UserMapper {
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "profile", ignore = true)
    User toUser(RegisterDto request);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Profile toProfile(RegisterDto request);

    @Mapping(source = "profile", target = "profileResponse")
    UserResponse toResponse(User user);
    RegisterDto toRegisterResponse(User user);
    List<UserResponse> toListResponse(List<User> users);
}
