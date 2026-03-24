package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.ApiResponse;
import com.eiu.testlab.fade.dto.UserResponse;
import com.eiu.testlab.fade.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<UserResponse>> getAllUser(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUsers())
                .build();
    }

    //Search users by username
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ApiResponse<List<UserResponse>> searchUsers(@RequestParam("q") String username) {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.searchUsersByUsername(username))
                .build();
    }

    //Get online users
    @GetMapping("/online")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ApiResponse<List<UserResponse>> getOnlineUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getOnlineUsers())
                .build();
    }

    //Get user by id
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ApiResponse<UserResponse> getUser(@PathVariable UUID id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(id))
                .build();
    }

    @PostMapping("/heartbeat")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ApiResponse<String> heartbeat() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = UUID.fromString(authentication.getName());
        userService.updateHeartbeat(userId);
        return ApiResponse.<String>builder().result("Heartbeat updated").build();
    }

    //Soft delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ApiResponse.<String>builder().result("User has been deleted").build();
    }
}
