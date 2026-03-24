package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.ApiResponse;
import com.eiu.testlab.fade.dto.NotificationResponse;
import com.eiu.testlab.fade.entity.Notification;
import com.eiu.testlab.fade.repository.NotificationRepository;
import com.eiu.testlab.fade.service.SseService;
import com.eiu.testlab.fade.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    SseService sseService;
    NotificationRepository notificationRepository;

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return sseService.subscribe(userId);
    }

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<List<NotificationResponse>> getMyNotifications() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        
        List<NotificationResponse> result = notifications.stream().map(n -> 
            NotificationResponse.builder()
                .id(n.getId())
                .actorName(n.getActor().getUserName())
                .actorAvatar(n.getActor().getProfile() != null ? n.getActor().getProfile().getAvatarUrl() : null)
                .type(n.getType())
                .relatedEntityId(n.getRelatedEntityId())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build()
        ).collect(Collectors.toList());

        return ApiResponse.<List<NotificationResponse>>builder().result(result).build();
    }

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @PutMapping("/{notificationId}/read")
    public ApiResponse<Void> markAsRead(@PathVariable UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            // Verify ownership if required, or simply check it belongs to currentUser
            if (n.getRecipient().getId().equals(SecurityUtils.getCurrentUserId())) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
        return ApiResponse.<Void>builder().message("Marked as read").build();
    }
}
