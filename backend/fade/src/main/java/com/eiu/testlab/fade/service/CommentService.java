package com.eiu.testlab.fade.service;

import com.eiu.testlab.fade.dto.Comment.CommentRequest;
import com.eiu.testlab.fade.dto.Comment.CommentResponse;
import com.eiu.testlab.fade.dto.PageResponse;
import com.eiu.testlab.fade.entity.Comment;
import com.eiu.testlab.fade.entity.Post;
import com.eiu.testlab.fade.entity.User;
import com.eiu.testlab.fade.enums.ErrorCode;
import com.eiu.testlab.fade.exception.AppException;
import com.eiu.testlab.fade.mapper.CommentMapper;
import com.eiu.testlab.fade.repository.CommentRepository;
import com.eiu.testlab.fade.repository.PostRepository;
import com.eiu.testlab.fade.repository.UserRepository;
import com.eiu.testlab.fade.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import com.eiu.testlab.fade.enums.NotificationType;
import com.eiu.testlab.fade.entity.Notification;
import com.eiu.testlab.fade.repository.NotificationRepository;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Builder
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class CommentService {
    CommentRepository commentRepository;
    PostRepository postRepository;
    UserRepository userRepository;
    CommentMapper commentMapper;
    NotificationRepository notificationRepository;
    SseService sseService;

    @Transactional
    public CommentResponse addComment(UUID postId, CommentRequest request){
        UUID currentUserId = SecurityUtils.getCurrentUserId();

        Post post = postRepository.findById(postId).orElseThrow(()-> new AppException(ErrorCode.POST_NOT_FOUND));
        User user = userRepository.findById(currentUserId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        Comment comment = Comment.builder()
                .owner(user).post(post).content(request.getContent())
                .build();
        commentRepository.save(comment);

        post.setCommentCount(post.getCommentCount()+1);
        postRepository.save(post);

        // Notify post owner if it's not their own comment
        if (!post.getOwner().getId().equals(currentUserId)) {
            Notification notification = Notification.builder()
                    .recipient(post.getOwner())
                    .actor(user)
                    .type(NotificationType.COMMENT)
                    .relatedEntityId(comment.getId())
                    .isRead(false)
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            notification = notificationRepository.save(notification);

            String payloadMsg = String.format("%s commented on your whisper", 
                user.getProfile() != null && user.getProfile().getFullName() != null 
                ? user.getProfile().getFullName() : user.getUserName());
            
            sseService.sendNotification(post.getOwner().getId(), java.util.Map.of(
                    "id", notification.getId(),
                    "relatedEntityId", comment.getId(),
                    "type", NotificationType.COMMENT.name(),
                    "message", payloadMsg,
                    "actorId", user.getId(),
                    "actorName", user.getUserName(),
                    "timestamp", notification.getCreatedAt().toString()
            ));
        }

        return commentMapper.toResponse(comment);
    }

    public PageResponse<CommentResponse> getCommentsByPostId(UUID postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable);
        List<CommentResponse> responses = commentPage.getContent().stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<CommentResponse>builder()
                .currentPage(page + 1)
                .totalPages(commentPage.getTotalPages())
                .pageSize(size)
                .totalElements(commentPage.getTotalElements())
                .data(responses)
                .build();
    }
}
