package com.eiu.testlab.fade.service;

import com.eiu.testlab.fade.dto.LoginDto;
import com.eiu.testlab.fade.dto.RegisterDto;
import com.eiu.testlab.fade.dto.TokenResponseDto;
import com.eiu.testlab.fade.entity.User;
import com.eiu.testlab.fade.enums.ErrorCode;
import com.eiu.testlab.fade.enums.Gender;
import com.eiu.testlab.fade.enums.UserStatus;
import com.eiu.testlab.fade.exception.AppException;
import com.eiu.testlab.fade.mapper.UserMapper;
import com.eiu.testlab.fade.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@Builder
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    //Register
    public RegisterDto register(RegisterDto request){
        User user = userMapper.toUser(request);
        user.setRole("USER");
        user.setStatus(UserStatus.ACTIVE);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        if (user.getProfile() != null) {
            user.getProfile().setUser(user);
        }
        try {
            User savedUser = userRepository.save(user);
            return userMapper.toRegisterResponse(savedUser);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
    }
    //Login
    public TokenResponseDto login(LoginDto request){
        var userOptional = userRepository.findByUserName(request.getUserName());

        if(userOptional.isEmpty()){
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        User user = userOptional.get();
        if(user.getStatus() == UserStatus.BANNED){
            throw new AppException(ErrorCode.ACCOUNT_BANNED);
        }
        if(user.getStatus() == UserStatus.DELETED){
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        if(!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return createTokenResponse(user);
    }
    //Create access and refresh token
    private TokenResponseDto createTokenResponse(User user){
        String accessToken = jwtService.createToken(user);
        String refreshToken = generateAndSetRefreshToken(user);
        return TokenResponseDto.builder().accessToken(accessToken).refreshToken(refreshToken).build();
    }
    //Validate token
    private User validateRefreshToken(UUID userId, String refreshToken){
        User user = userRepository.findById(userId).orElse(null);
        if(user == null || user.getRefreshToken() == null
        || !user.getRefreshToken().equals(refreshToken) || user.getTokenExpireTime().isBefore(LocalDateTime.now())){
            return null;
        }
        return user;
    }
    //Generate and set to user
    private String generateAndSetRefreshToken(User user){
        String refreshToken = generateRefreshTokenString();
        user.setRefreshToken(refreshToken);
        user.setTokenExpireTime(LocalDateTime.now().plusDays(1));
        userRepository.save(user);
        return refreshToken;
    }
    //Generate
    private String generateRefreshTokenString(){
        byte[] random = new byte[64];
        secureRandom.nextBytes(random);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(random);
    }
}
