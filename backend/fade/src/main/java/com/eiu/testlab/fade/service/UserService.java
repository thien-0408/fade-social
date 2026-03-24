package com.eiu.testlab.fade.service;

import com.eiu.testlab.fade.dto.RegisterDto;
import com.eiu.testlab.fade.dto.User.ChangePasswordDto;
import com.eiu.testlab.fade.dto.UserResponse;
import com.eiu.testlab.fade.entity.User;
import com.eiu.testlab.fade.enums.ErrorCode;
import com.eiu.testlab.fade.enums.UserStatus;
import com.eiu.testlab.fade.exception.AppException;
import com.eiu.testlab.fade.mapper.UserMapper;
import com.eiu.testlab.fade.repository.UserRepository;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Builder
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    PasswordEncoder encoder;
    UserMapper userMapper;

    public List<UserResponse> getAllUsers(){
        return userMapper.toListResponse(userRepository.findAll());
    }

    public UserResponse getUserById(UUID id){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toResponse(user);
    }

    public void updateHeartbeat(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setLastActiveAt(java.time.LocalDateTime.now());
        userRepository.save(user);
    }

    public void deleteUser(UUID id) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    if(user.getStatus() == UserStatus.DELETED){
        throw new AppException(ErrorCode.USER_NOT_FOUND);
    }
        user.setStatus(UserStatus.DELETED);
        userRepository.save(user);
    }

    public UserResponse createUser(RegisterDto request){
        if(userRepository.existsByUserName(request.getUserName())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        User user = userMapper.toUser(request);
        user.setPasswordHash(encoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);

        return userMapper.toResponse(user);
    }

    public boolean changePassword(UUID userId, ChangePasswordDto request){
        User currentUser = userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        if(!request.getCurrentPassword().matches(currentUser.getPasswordHash())){
            return false;
        }
        String newHashedPass = encoder.encode(request.getNewPassword());
        currentUser.setPasswordHash(newHashedPass);
        userRepository.save(currentUser);
        return true;
    }

    public List<UserResponse> searchUsersByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return List.of();
        }
        return userMapper.toListResponse(userRepository.findByUserNameContainingIgnoreCase(username.trim()));
    }

    public List<UserResponse> getOnlineUsers() {
        return userMapper.toListResponse(userRepository.findTop15ByLastActiveAtIsNotNullOrderByLastActiveAtDesc());
    }
}
