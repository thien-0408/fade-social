package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.Chat.ChatMessageRequest;
import com.eiu.testlab.fade.dto.Chat.ChatMessageResponse;
import com.eiu.testlab.fade.service.ChatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatWebSocketController {

    ChatService chatService;
    SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatWsRequest request) {
        ChatMessageRequest msgRequest = ChatMessageRequest.builder()
                .recipientId(request.getRecipientId())
                .content(request.getContent())
                .build();

        ChatMessageResponse saved = chatService.saveMessage(msgRequest, request.getSenderId());

        messagingTemplate.convertAndSend(
                "/user/" + request.getRecipientId() + "/queue/messages",
                saved
        );

        messagingTemplate.convertAndSend(
                "/user/" + request.getSenderId() + "/queue/messages",
                saved
        );
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ChatWsRequest {
        private UUID senderId;
        private UUID recipientId;
        private String content;
    }
}
