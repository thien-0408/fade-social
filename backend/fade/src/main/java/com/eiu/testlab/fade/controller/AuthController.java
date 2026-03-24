package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.LoginDto;
import com.eiu.testlab.fade.dto.RegisterDto;
import com.eiu.testlab.fade.dto.TokenResponseDto;
import com.eiu.testlab.fade.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping(value = "/register")
    public ResponseEntity<RegisterDto> register(@RequestBody @Valid RegisterDto request){
        return ResponseEntity.ok(authService.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody LoginDto request){
        return ResponseEntity.ok(authService.login(request));
    }
}
