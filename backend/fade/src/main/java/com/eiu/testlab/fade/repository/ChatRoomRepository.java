package com.eiu.testlab.fade.repository;

import com.eiu.testlab.fade.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
    Optional<ChatRoom> findByChatId(String chatId);

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.sender.id = :userId OR cr.recipient.id = :userId")
    List<ChatRoom> findAllByUserId(UUID userId);

    Optional<ChatRoom> findBySenderIdAndRecipientId(UUID senderId, UUID recipientId);
}
