package com.eiu.testlab.fade.service;

import com.eiu.testlab.fade.dto.RegisterDto;
import com.eiu.testlab.fade.dto.UserResponse;
import com.eiu.testlab.fade.entity.User;
import com.eiu.testlab.fade.enums.ErrorCode;
import com.eiu.testlab.fade.enums.UserStatus;
import com.eiu.testlab.fade.exception.AppException;
import com.eiu.testlab.fade.mapper.ProfileMapper;
import com.eiu.testlab.fade.mapper.UserMapper;
import com.eiu.testlab.fade.repository.ProfileRepository;
import com.eiu.testlab.fade.repository.UserRepository;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Builder
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminService {
    UserRepository userRepository;
    UserMapper userMapper;
    ProfileRepository profileRepository;
    PasswordEncoder encoder;
    ProfileMapper profileMapper;


}
