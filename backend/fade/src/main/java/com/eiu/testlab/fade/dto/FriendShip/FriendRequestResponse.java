package com.eiu.testlab.fade.dto.FriendShip;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class FriendRequestResponse {
    private UUID requestId;
    private UUID requesterId;
    private String fullName;
    private String userName;
    private String avatarUrl;
    private LocalDateTime createdAt;

}
