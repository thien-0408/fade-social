package com.eiu.testlab.fade.dto.Comment;

import com.eiu.testlab.fade.dto.Post.PostOwnerResponse;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentResponse {
    UUID id;
    UUID postId;
    PostOwnerResponse owner;
    String content;
    LocalDateTime createdAt;
}
