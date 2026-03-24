package com.eiu.testlab.fade.dto;

import com.eiu.testlab.fade.enums.NotificationType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    UUID id;
    String actorName;
    String actorAvatar;
    NotificationType type;
    UUID relatedEntityId;
    boolean isRead;
    LocalDateTime createdAt;
}
