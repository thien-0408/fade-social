package com.eiu.testlab.fade.mapper;

import com.eiu.testlab.fade.dto.Comment.CommentResponse;
import com.eiu.testlab.fade.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

//reuse PostMapper's logic
@Mapper(componentModel = "spring", uses = {PostMapper.class})
public interface CommentMapper {
    // take post id to dto
    //postOwner automatically mapped by postMapper
    @Mapping(source = "post.id", target = "postId")
    CommentResponse toResponse(Comment comment);

    List<CommentResponse> toListResponse(List<Comment> comments);
}