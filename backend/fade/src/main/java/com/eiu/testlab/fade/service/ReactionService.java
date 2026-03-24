package com.eiu.testlab.fade.service;

import com.eiu.testlab.fade.entity.Post;
import com.eiu.testlab.fade.entity.Reaction;
import com.eiu.testlab.fade.entity.User;
import com.eiu.testlab.fade.enums.ReactionType;
import com.eiu.testlab.fade.exception.AppException;
import com.eiu.testlab.fade.enums.ErrorCode;
import com.eiu.testlab.fade.repository.PostRepository;
import com.eiu.testlab.fade.repository.ReactionRepository;
import com.eiu.testlab.fade.repository.UserRepository;
import com.eiu.testlab.fade.utils.SecurityUtils;
import com.eiu.testlab.fade.enums.NotificationType;
import com.eiu.testlab.fade.entity.Notification;
import com.eiu.testlab.fade.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SseService sseService;

    @Transactional
    public void toggleReaction(UUID postId, ReactionType newType) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Optional<Reaction> existingReactionOpt = reactionRepository.findByPostIdAndUserId(postId, currentUserId);

        if (existingReactionOpt.isPresent()) {
            Reaction existingReaction = existingReactionOpt.get();

            if (existingReaction.getType() == newType) {
                //unlike
                reactionRepository.delete(existingReaction);
                decrementPostReactionCount(post, newType);
            } else {
                //switch emoji
                ReactionType oldType = existingReaction.getType();
                existingReaction.setType(newType);
                reactionRepository.save(existingReaction);

                decrementPostReactionCount(post, oldType);
                incrementPostReactionCount(post, newType);
            }
        } else {
            //if not exist -> create new
            Reaction newReaction = Reaction.builder()
                    .post(post)
                    .user(user)
                    .type(newType)
                    .build();
            reactionRepository.save(newReaction);
            incrementPostReactionCount(post, newType);

            // Notify post owner if it's not their own reaction
            if (!post.getOwner().getId().equals(currentUserId)) {
                Notification notification = Notification.builder()
                        .recipient(post.getOwner())
                        .actor(user)
                        .type(NotificationType.LOVE)
                        .relatedEntityId(post.getId())
                        .isRead(false)
                        .createdAt(java.time.LocalDateTime.now())
                        .build();
                notification = notificationRepository.save(notification);

                String payloadMsg = String.format("%s resonated with your whisper", 
                    user.getProfile() != null && user.getProfile().getFullName() != null 
                    ? user.getProfile().getFullName() : user.getUserName());
                
                sseService.sendNotification(post.getOwner().getId(), java.util.Map.of(
                        "id", notification.getId(),
                        "relatedEntityId", post.getId(),
                        "type", NotificationType.LOVE.name(),
                        "message", payloadMsg,
                        "actorId", user.getId(),
                        "actorName", user.getUserName(),
                        "timestamp", notification.getCreatedAt().toString()
                ));
            }
        }
        postRepository.save(post);
    }

    // count helper
    private void incrementPostReactionCount(Post post, ReactionType type) {
        if (type == ReactionType.LOVE) {
            post.setLoveCount(post.getLoveCount() + 1);
        }
        post.setTotalReactions(post.getTotalReactions() + 1);
    }

    private void decrementPostReactionCount(Post post, ReactionType type) {
        if (type == ReactionType.LOVE) {
            post.setLoveCount(Math.max(0, post.getLoveCount() - 1));
        }
        post.setTotalReactions(Math.max(0, post.getTotalReactions() - 1));
    }
}