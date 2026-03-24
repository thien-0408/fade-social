package com.eiu.testlab.fade.dto.Post;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PostOwnerResponse {
    private UUID id;
    private String userName;
    private String fullName;
    private String avatarUrl;
}
