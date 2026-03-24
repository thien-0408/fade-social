package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.ProfileCreationRequest;
import com.eiu.testlab.fade.dto.ProfileResponse;
import com.eiu.testlab.fade.enums.Gender;
import com.eiu.testlab.fade.service.ProfileService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("api/profiles")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class ProfileController {
    ProfileService profileService;

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> addProfile(
            @RequestParam("bio") String bio,
            @RequestParam("fullName") String fullName,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("gender") Gender gender,
            @RequestParam("dateOfBirth") LocalDate dateOfBirth,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage
    ) throws IOException {
        ProfileCreationRequest request = ProfileCreationRequest.builder()
                .bio(bio)
                .fullName(fullName)
                .phoneNumber(phoneNumber)
                .gender(gender)
                .dateOfBirth(dateOfBirth)
                .avatar(avatar)
                .coverImage(coverImage)
                .build();
        return ResponseEntity.ok(profileService.createProfile(request));
    }

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> updateProfile(
            @RequestParam("bio") String bio,
            @RequestParam("fullName") String fullName,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("gender") Gender gender,
            @RequestParam("dateOfBirth") LocalDate dateOfBirth,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage
    ) throws IOException {
        ProfileCreationRequest request = ProfileCreationRequest.builder()
                .bio(bio)
                .fullName(fullName)
                .phoneNumber(phoneNumber)
                .gender(gender)
                .dateOfBirth(dateOfBirth)
                .avatar(avatar)
                .coverImage(coverImage)
                .build();
        return ResponseEntity.ok(profileService.updateProfile(request));
    }
}
