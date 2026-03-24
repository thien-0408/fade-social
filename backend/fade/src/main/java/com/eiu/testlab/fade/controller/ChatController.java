package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.ApiResponse;
import com.eiu.testlab.fade.dto.Chat.ChatMessageResponse;
import com.eiu.testlab.fade.dto.Chat.ChatRoomResponse;
import com.eiu.testlab.fade.dto.PageResponse;
import com.eiu.testlab.fade.service.ChatService;
import com.eiu.testlab.fade.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    ChatService chatService;

    @GetMapping("/rooms")
    public ApiResponse<List<ChatRoomResponse>> getChatRooms() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<ChatRoomResponse> rooms = chatService.getChatRoomsForUser(userId);
        return ApiResponse.<List<ChatRoomResponse>>builder()
                .result(rooms)
                .build();
    }

    @GetMapping("/rooms/{chatId}/messages")
    public ApiResponse<PageResponse<ChatMessageResponse>> getMessages(
            @PathVariable String chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageResponse<ChatMessageResponse> messages = chatService.getMessages(chatId, page, size);
        return ApiResponse.<PageResponse<ChatMessageResponse>>builder()
                .result(messages)
                .build();
    }

    @GetMapping("/{friendId}/room")
    public ApiResponse<String> getOrCreateRoom(@PathVariable UUID friendId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        String chatId = chatService.getOrCreateChatRoom(userId, friendId);
        return ApiResponse.<String>builder()
                .result(chatId)
                .build();
    }
}
