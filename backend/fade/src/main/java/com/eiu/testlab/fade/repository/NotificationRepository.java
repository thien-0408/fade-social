package com.eiu.testlab.fade.repository;

import com.eiu.testlab.fade.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(UUID recipientId);
    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(UUID recipientId);
    void deleteByRelatedEntityIdAndType(UUID relatedEntityId, com.eiu.testlab.fade.enums.NotificationType type);
}
