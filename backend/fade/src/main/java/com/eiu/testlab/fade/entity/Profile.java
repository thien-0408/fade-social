package com.eiu.testlab.fade.entity;

import com.eiu.testlab.fade.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "profiles",indexes = {
        @Index(name = "idx_profile_fullname", columnList = "full_name"),
        @Index(name = "idx_profile_phone", columnList = "phone_number", unique = true)
})
public class Profile {
    @Id
    UUID id;
    String bio;
    String coverImageUrl;
    String avatarUrl;
    String fullName;
    String phoneNumber;
    Gender gender; //enum, MALE, FEMALE, OTHER
    LocalDate dateOfBirth;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    User user;
}
