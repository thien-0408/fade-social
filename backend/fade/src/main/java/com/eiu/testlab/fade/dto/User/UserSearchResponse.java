package com.eiu.testlab.fade.dto.User;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class UserSearchResponse {
    private UUID id;
    private String fullName;
    private String avatarUrl;
    private boolean isFriend;
    private int mutualFriendsCount;
    private java.time.LocalDateTime lastActiveAt;
}
