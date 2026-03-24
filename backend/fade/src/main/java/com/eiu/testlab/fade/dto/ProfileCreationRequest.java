package com.eiu.testlab.fade.dto;

import com.eiu.testlab.fade.enums.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileCreationRequest {
    String bio;
    MultipartFile coverImage;
    MultipartFile avatar;
    String fullName;
    String phoneNumber;
    Gender gender; //enum, MALE, FEMALE, OTHER
    LocalDate dateOfBirth;
}
