package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.ApiResponse;
import com.eiu.testlab.fade.dto.FriendShip.FriendRequestResponse;
import com.eiu.testlab.fade.dto.UserResponse;
import com.eiu.testlab.fade.service.FriendShipService;
import com.eiu.testlab.fade.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/friendships")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendShipController {
    FriendShipService friendShipService;

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @PostMapping("{receiverId}/send")
    public ApiResponse<String> sendFriendRequest(@PathVariable UUID receiverId){
        friendShipService.sendFriendRequest(receiverId);
        return ApiResponse.<String>builder()
                .message("Friend request sent.")
                .result("Pending")
                .build();
    }

    @GetMapping("/requests/incoming")
    public ApiResponse<List<FriendRequestResponse>> getIncomingRequests() {
        List<FriendRequestResponse> responses = friendShipService.getIncomingList();
        return ApiResponse.<List<FriendRequestResponse>>builder()
                .result(responses)
                .build();
    }

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @PostMapping("requests/{requestId}/accept")
    public ApiResponse<Void> acceptRequest(@PathVariable UUID requestId){
        friendShipService.acceptFriendRequest(requestId);
        return ApiResponse.<Void>builder()
                .message("Friend request accepted.")
                .build();
    }

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @PostMapping("/requests/{requestId}/decline")
    public ApiResponse<Void> declineRequest(@PathVariable UUID requestId) {

        friendShipService.declineFriendRequest(requestId);

        return ApiResponse.<Void>builder()
                .message("Friend request declined.")
                .build();
    }

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @GetMapping("/friends")
    public ApiResponse<List<UserResponse>> getMyFriends() {

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        List<UserResponse> friends = friendShipService.getUserFriends(currentUserId);
        return ApiResponse.<List<UserResponse>>builder()
                .result(friends)
                .build();
    }

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @GetMapping("/{userId}/friends")
    public ApiResponse<List<UserResponse>> getUserFriends(@PathVariable UUID userId) {
        List<UserResponse> friends = friendShipService.getUserFriends(userId);
        return ApiResponse.<List<UserResponse>>builder()
                .result(friends)
                .build();
    }

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @DeleteMapping("/{targetUserId}/unfriend")
    public ApiResponse<Void> unfriend(@PathVariable UUID targetUserId) {
        friendShipService.unfriend(targetUserId);
        return ApiResponse.<Void>builder()
                .message("Unfriended successfully.")
                .build();
    }

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @GetMapping("/status/{targetUserId}")
    public ApiResponse<String> checkFriendshipStatus(@PathVariable UUID targetUserId) {
        return ApiResponse.<String>builder()
                .result(friendShipService.checkFriendshipStatus(targetUserId))
                .build();
    }

}
