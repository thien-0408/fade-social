package com.eiu.testlab.fade.dto;

import com.eiu.testlab.fade.enums.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserResponse {
    private UUID id;
    private String userName;
    private String email;
    private String role;
    private UserStatus status;
    private LocalDateTime lastActiveAt;
    private ProfileResponse profileResponse;
}
