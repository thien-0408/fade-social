package com.eiu.testlab.fade.service;

import com.eiu.testlab.fade.dto.ProfileCreationRequest;
import com.eiu.testlab.fade.dto.ProfileResponse;
import com.eiu.testlab.fade.entity.Profile;
import com.eiu.testlab.fade.entity.User;
import com.eiu.testlab.fade.enums.ErrorCode;
import com.eiu.testlab.fade.enums.Gender;
import com.eiu.testlab.fade.exception.AppException;
import com.eiu.testlab.fade.mapper.ProfileMapper;
import com.eiu.testlab.fade.repository.ProfileRepository;
import com.eiu.testlab.fade.repository.UserRepository;
import com.eiu.testlab.fade.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final FileService fileService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    @Transactional
    public ProfileResponse createProfile(ProfileCreationRequest request) throws IOException {
        UUID currentUserId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(currentUserId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        if (profileRepository.existsById(user.getId())) {
            throw new AppException(ErrorCode.PROFILE_EXISTED);
        }
        Profile profile = profileMapper.toEntity(request);

        if (request.getCoverImage() != null && !request.getCoverImage().isEmpty()) {
            String coverUrl = fileService.uploadFile(request.getCoverImage(), "cover_images");
            profile.setCoverImageUrl(coverUrl);
        }
        if(request.getGender().equals(Gender.FEMALE)){
            profile.setAvatarUrl("/uploads/avatars/default-female-avatar.png");
        }else if(request.getGender().equals(Gender.MALE)){
            profile.setAvatarUrl("/uploads/avatars/default-male-avatar.png");
        }else{
            profile.setAvatarUrl("/uploads/avatars/default-avatar.png");
        }
        profile.setUser(user);
        Profile savedProfile = profileRepository.save(profile);
        return profileMapper.toResponse(savedProfile);
    }

    @Transactional
    public ProfileResponse updateProfile(ProfileCreationRequest request) throws IOException {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        
        // Find existing profile or throw exception if not found
        Profile profile = profileRepository.findById(user.getId())
            .orElseThrow(() -> new RuntimeException("Profile not found"));
            
        // Update basic info
        profile.setBio(request.getBio());
        profile.setFullName(request.getFullName());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setGender(request.getGender());
        profile.setDateOfBirth(request.getDateOfBirth());
        
        // Handle cover image
        if (request.getCoverImage() != null && !request.getCoverImage().isEmpty()) {
            if (profile.getCoverImageUrl() != null) {
                fileService.deleteFile(profile.getCoverImageUrl());
            }
            String coverUrl = fileService.uploadFile(request.getCoverImage(), "cover_images");
            profile.setCoverImageUrl(coverUrl);
        }
        
        // Handle avatar image
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            // Delete old avatar if it's not a default one
            if (profile.getAvatarUrl() != null && !profile.getAvatarUrl().contains("default")) {
                fileService.deleteFile(profile.getAvatarUrl());
            }
            String avatarUrl = fileService.uploadFile(request.getAvatar(), "avatars");
            profile.setAvatarUrl(avatarUrl);
        } else if (profile.getAvatarUrl() == null || profile.getAvatarUrl().contains("default")) {
            // Re-assign default if gender changed and they don't have a custom avatar
            if (request.getGender().equals(Gender.FEMALE)) {
                profile.setAvatarUrl("/uploads/avatars/default-female-avatar.png");
            } else if (request.getGender().equals(Gender.MALE)) {
                profile.setAvatarUrl("/uploads/avatars/default-male-avatar.png");
            } else {
                profile.setAvatarUrl("/uploads/avatars/default-avatar.png");
            }
        }
        
        Profile savedProfile = profileRepository.save(profile);
        return profileMapper.toResponse(savedProfile);
    }
}
