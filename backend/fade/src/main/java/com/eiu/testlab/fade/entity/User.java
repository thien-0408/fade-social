package com.eiu.testlab.fade.entity;

import com.eiu.testlab.fade.enums.Gender;
import com.eiu.testlab.fade.enums.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users", indexes = {
        @Index(name = "idx_user_status", columnList = "status"),
        @Index(name = "idx_user_last_active", columnList = "last_active_at")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(unique = true)
    String userName;
    String role;

    @Size(min = 8, message = "Password must be at least 8 characters")
    @Column(nullable = false)
    String passwordHash;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    Profile profile;

    @Column(nullable = false, unique = true)
    String email;

    @Enumerated(EnumType.STRING)
    UserStatus status = UserStatus.ACTIVE;

    private String refreshToken;
    private LocalDateTime tokenExpireTime;
    private LocalDateTime lastActiveAt;

    public void setProfile(Profile profile) {
        if (profile == null) {
            if (this.profile != null) {
                this.profile.setUser(null);
            }
        } else {
            profile.setUser(this);
        }
        this.profile = profile;
    }
}

