package com.eiu.testlab.fade.entity;

import com.eiu.testlab.fade.enums.PostType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "posts", indexes = {
        @Index(name = "idx_post_expires_at", columnList = "expires_at"),
        @Index(name = "idx_post_owner_created", columnList = "owner_id, created_at DESC")
})
public abstract class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    User owner;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_type", nullable = false)
    PostType type;

    String textContent;
    String mediaUrl;

    @Column(name = "ttl_minutes", nullable = false)
    int ttlMinutes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @Column(name = "expires_at")
    LocalDateTime expiresAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Reaction> reactions = new ArrayList<>();

    @Column(columnDefinition = "integer default 0")
    int loveCount = 0;

    @Column(columnDefinition = "integer default 0")
    int totalReactions = 0;

    @Column(columnDefinition = "integer default 0")
    int commentCount = 0;

    //calculate before save to db
    @PrePersist
    public void calculateExpiration() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        this.expiresAt = createdAt.plusMinutes(ttlMinutes);
    }
}
