package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.ApiResponse;
import com.eiu.testlab.fade.enums.ReactionType;
import com.eiu.testlab.fade.service.ReactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class ReactionController {
    ReactionService reactionService;

    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    @PostMapping("/{postId}/reactions")
    public ApiResponse<Void> toggleReaction(
            @PathVariable UUID postId,
            @RequestParam ReactionType type
    ) {
        reactionService.toggleReaction(postId, type);

        return ApiResponse.<Void>builder()
                .message("Reaction toggled successfully.")
                .build();
    }
}
