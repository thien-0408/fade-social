package com.eiu.testlab.fade.entity;

import com.eiu.testlab.fade.enums.FriendShipStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "friend_ship",
        indexes = {
                @Index(name = "idx_requester_status", columnList = "requester_id, status"),
                @Index(name = "idx_addressee_status", columnList = "addressee_id, status")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_requester_addressee", columnNames = {"requester_id", "addressee_id"})
        }
)
public class FriendShip {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "addressee_id", nullable = false)
    User addressee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    FriendShipStatus status = FriendShipStatus.PENDING; // PENDING, ACCEPTED, BLOCKED

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;
}
