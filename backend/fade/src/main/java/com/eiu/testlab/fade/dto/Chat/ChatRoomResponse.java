package com.eiu.testlab.fade.dto.Chat;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatRoomResponse {
    String chatId;
    UUID friendId;
    String friendName;
    String friendAvatar;
    String lastMessage;
    LocalDateTime lastMessageTime;
    LocalDateTime friendLastActiveAt;
}
