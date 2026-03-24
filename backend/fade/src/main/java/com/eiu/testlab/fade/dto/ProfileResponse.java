package com.eiu.testlab.fade.dto;

import com.eiu.testlab.fade.enums.Gender;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class ProfileResponse {
    private UUID id;
    private String fullName;
    private String bio;
    private String phoneNumber;
    private Gender gender;
    private LocalDate dateOfBirth;
    private MultipartFile avatar;
    private String avatarUrl;
    private MultipartFile coverImage;
    private String coverImageUrl;
}
