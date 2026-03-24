package com.eiu.testlab.fade.mapper;

import com.eiu.testlab.fade.dto.Post.PostOwnerResponse;
import com.eiu.testlab.fade.dto.Post.PostResponse;
import com.eiu.testlab.fade.entity.Post;
import com.eiu.testlab.fade.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(source = "owner", target = "owner")
    PostResponse toResponse(Post post);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "userName", target = "userName")
    @Mapping(target = "fullName",
            expression = "java(user.getProfile() != null ? user.getProfile().getFullName() : user.getUserName())")
    @Mapping(target = "avatarUrl",
            expression = "java(user.getProfile() != null ? user.getProfile().getAvatarUrl() : null)")
    PostOwnerResponse mapOwner(User user);

    List<PostResponse> toListResponse(List<Post> posts);
}
