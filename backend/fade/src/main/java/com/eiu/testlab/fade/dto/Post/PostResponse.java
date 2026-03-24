package com.eiu.testlab.fade.dto.Post;

import com.eiu.testlab.fade.dto.Comment.CommentResponse;
import com.eiu.testlab.fade.enums.PostType;
import com.eiu.testlab.fade.enums.ReactionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PostResponse {
    private UUID id;
    private PostOwnerResponse owner;
    private CommentResponse comment;
    private PostType type;
    private String textContent;
    private String mediaUrl;
    private int loveCount;
    private int totalReactions;
    private int commentCount;
    private int ttlMinutes;
    private ReactionType currentReaction;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
