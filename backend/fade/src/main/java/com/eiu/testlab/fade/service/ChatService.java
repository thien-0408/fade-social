package com.eiu.testlab.fade.service;

import com.eiu.testlab.fade.dto.Chat.ChatMessageRequest;
import com.eiu.testlab.fade.dto.Chat.ChatMessageResponse;
import com.eiu.testlab.fade.dto.Chat.ChatRoomResponse;
import com.eiu.testlab.fade.dto.PageResponse;
import com.eiu.testlab.fade.entity.ChatMessage;
import com.eiu.testlab.fade.entity.ChatRoom;
import com.eiu.testlab.fade.entity.FriendShip;
import com.eiu.testlab.fade.entity.User;
import com.eiu.testlab.fade.enums.ErrorCode;
import com.eiu.testlab.fade.exception.AppException;
import com.eiu.testlab.fade.repository.ChatMessageRepository;
import com.eiu.testlab.fade.repository.ChatRoomRepository;
import com.eiu.testlab.fade.repository.FriendShipRepository;
import com.eiu.testlab.fade.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatService {

    ChatRoomRepository chatRoomRepository;
    ChatMessageRepository chatMessageRepository;
    FriendShipRepository friendShipRepository;
    UserRepository userRepository;

    /**
     * Get or create a chat room between two users.
     * ChatRoom uses a deterministic chatId built from the sorted UUIDs so
     * the pair always produces the same room regardless of who initiates.
     */
    @Transactional
    public String getOrCreateChatRoom(UUID userId1, UUID userId2) {
        String chatId = buildChatId(userId1, userId2);

        Optional<ChatRoom> existing = chatRoomRepository.findByChatId(chatId);
        if (existing.isPresent()) {
            return chatId;
        }

        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Create the single room entry
        ChatRoom room = ChatRoom.builder()
                .chatId(chatId)
                .sender(user1)
                .recipient(user2)
                .build();
        chatRoomRepository.save(room);

        return chatId;
    }

    /**
     * Returns all chat rooms for the user, including empty rooms for friends
     * who don't have a conversation yet.
     */
    public List<ChatRoomResponse> getChatRoomsForUser(UUID userId) {
        // 1. Get existing chat rooms
        List<ChatRoom> rooms = chatRoomRepository.findAllByUserId(userId);
        Set<UUID> existingFriendIds = new HashSet<>();

        List<ChatRoomResponse> result = new ArrayList<>();

        for (ChatRoom room : rooms) {
            UUID friendId = room.getSender().getId().equals(userId)
                    ? room.getRecipient().getId()
                    : room.getSender().getId();
            existingFriendIds.add(friendId);

            User friend = room.getSender().getId().equals(userId) ? room.getRecipient() : room.getSender();
            Optional<ChatMessage> lastMsg = chatMessageRepository.findTopByChatIdOrderByTimestampDesc(room.getChatId());

            result.add(ChatRoomResponse.builder()
                    .chatId(room.getChatId())
                    .friendId(friendId)
                    .friendName(getFriendDisplayName(friend))
                    .friendAvatar(getFriendAvatar(friend))
                    .lastMessage(lastMsg.map(ChatMessage::getContent).orElse(null))
                    .lastMessageTime(lastMsg.map(ChatMessage::getTimestamp).orElse(null))
                    .friendLastActiveAt(friend.getLastActiveAt())
                    .build());
        }

        // 2. Add empty rooms for friends who don't have a chat room yet
        List<FriendShip> friendships = friendShipRepository.findAllFriendsByUserId(userId);
        for (FriendShip fs : friendships) {
            UUID friendId = fs.getRequester().getId().equals(userId)
                    ? fs.getAddressee().getId()
                    : fs.getRequester().getId();

            if (!existingFriendIds.contains(friendId)) {
                User friend = fs.getRequester().getId().equals(userId)
                        ? fs.getAddressee()
                        : fs.getRequester();

                String chatId = buildChatId(userId, friendId);

                result.add(ChatRoomResponse.builder()
                        .chatId(chatId)
                        .friendId(friendId)
                        .friendName(getFriendDisplayName(friend))
                        .friendAvatar(getFriendAvatar(friend))
                        .lastMessage(null)
                        .lastMessageTime(null)
                        .friendLastActiveAt(friend.getLastActiveAt())
                        .build());
            }
        }

        // Sort: rooms with messages first (by time desc), then empty rooms
        result.sort((a, b) -> {
            if (a.getLastMessageTime() == null && b.getLastMessageTime() == null) return 0;
            if (a.getLastMessageTime() == null) return 1;
            if (b.getLastMessageTime() == null) return -1;
            return b.getLastMessageTime().compareTo(a.getLastMessageTime());
        });

        return result;
    }

    /**
     * Saves a chat message and returns the response DTO.
     */
    @Transactional
    public ChatMessageResponse saveMessage(ChatMessageRequest request, UUID senderId) {
        UUID recipientId = request.getRecipientId();
        String chatId = getOrCreateChatRoom(senderId, recipientId);

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        ChatMessage message = ChatMessage.builder()
                .chatId(chatId)
                .sender(sender)
                .recipient(recipient)
                .content(request.getContent())
                .build();

        message = chatMessageRepository.save(message);

        return toMessageResponse(message);
    }

    /**
     * Paginated messages for a chat room (newest first).
     */
    public PageResponse<ChatMessageResponse> getMessages(String chatId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messagePage = chatMessageRepository.findByChatIdOrderByTimestampDesc(chatId, pageable);

        List<ChatMessageResponse> data = messagePage.getContent().stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());

        return PageResponse.<ChatMessageResponse>builder()
                .currentPage(messagePage.getNumber())
                .totalPages(messagePage.getTotalPages())
                .pageSize(messagePage.getSize())
                .totalElements(messagePage.getTotalElements())
                .data(data)
                .build();
    }

    // ── Helpers ──────────────────────────────────────────────

    private String buildChatId(UUID id1, UUID id2) {
        // Sort so the pair always produces the same chatId
        String s1 = id1.toString();
        String s2 = id2.toString();
        return s1.compareTo(s2) < 0 ? s1 + "_" + s2 : s2 + "_" + s1;
    }

    private String getFriendDisplayName(User user) {
        if (user.getProfile() != null && user.getProfile().getFullName() != null) {
            return user.getProfile().getFullName();
        }
        return user.getUserName();
    }

    private String getFriendAvatar(User user) {
        if (user.getProfile() != null) {
            return user.getProfile().getAvatarUrl();
        }
        return null;
    }

    private ChatMessageResponse toMessageResponse(ChatMessage msg) {
        return ChatMessageResponse.builder()
                .id(msg.getId())
                .chatId(msg.getChatId())
                .senderId(msg.getSender().getId())
                .senderName(getFriendDisplayName(msg.getSender()))
                .senderAvatar(getFriendAvatar(msg.getSender()))
                .recipientId(msg.getRecipient().getId())
                .content(msg.getContent())
                .timestamp(msg.getTimestamp())
                .build();
    }
}
