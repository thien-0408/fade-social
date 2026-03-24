package com.eiu.testlab.fade.service;

import com.eiu.testlab.fade.dto.PageResponse;
import com.eiu.testlab.fade.dto.Post.PostCreationRequest;
import com.eiu.testlab.fade.dto.Post.PostResponse;
import com.eiu.testlab.fade.entity.*;
import com.eiu.testlab.fade.enums.ErrorCode;
import com.eiu.testlab.fade.enums.PostType;
import com.eiu.testlab.fade.enums.ReactionType;
import com.eiu.testlab.fade.exception.AppException;
import com.eiu.testlab.fade.mapper.PostMapper;
import com.eiu.testlab.fade.repository.PostRepository;
import com.eiu.testlab.fade.repository.ReactionRepository;
import com.eiu.testlab.fade.repository.UserRepository;
import com.eiu.testlab.fade.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Builder
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    UserRepository userRepository;
    FileService fileService;
    PostMapper postMapper;
    ReactionRepository reactionRepository;


    public PostResponse createPost(PostCreationRequest request){
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User owner = userRepository.findById(currentUserId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));

        Post post;
        switch (request.getType()) {
            case THOUGHT -> post = new ThoughtPost();
            case MEDIA -> post = new MediaPost();
            default -> throw new AppException(ErrorCode.INVALID_POST_TYPE);
        }

        post.setOwner(owner);
        post.setType(request.getType());
        post.setTextContent(request.getContent());
        post.setTtlMinutes(request.getTtlMinutes());

        if (request.getType() == PostType.MEDIA) {
            if (request.getMediaFile() == null || request.getMediaFile().isEmpty()) {
                throw new AppException(ErrorCode.INVALID_POST_TYPE);
            }
            try {
                String mediaUrl = fileService.uploadFile(request.getMediaFile(), "media/posts");
                post.setMediaUrl(mediaUrl);
            } catch (IOException e) {
                throw new RuntimeException("Error uploading file: " + e.getMessage());
            }
        }

        Post savedPost = postRepository.save(post);
        return postMapper.toResponse(savedPost);
    }

    public PostResponse updatePost(UUID postId, String content, org.springframework.web.multipart.MultipartFile mediaFile) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        if (!post.getOwner().getId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (content != null) {
            post.setTextContent(content);
        }

        if (mediaFile != null && !mediaFile.isEmpty()) {
            try {
                String mediaUrl = fileService.uploadFile(mediaFile, "media/posts");
                post.setMediaUrl(mediaUrl);
            } catch (IOException e) {
                throw new RuntimeException("Error uploading file: " + e.getMessage());
            }
        }

        Post savedPost = postRepository.save(post);
        return postMapper.toResponse(savedPost);
    }

    public void deletePost(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        UUID currentUserId = SecurityUtils.getCurrentUserId();

        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().anyMatch(a -> ("ROLE_ADMIN").equals(a.getAuthority()));

        if (!post.getOwner().getId().equals(currentUserId) && !isAdmin) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        postRepository.delete(post);
    }

    public PostResponse getPost(UUID postId) {
         Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        if (post.getExpiresAt() != null && post.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }
        PostResponse response = postMapper.toResponse(post);
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        reactionRepository.findByPostIdAndUserId(postId, currentUserId)
                .ifPresent(reaction -> response.setCurrentReaction(ReactionType.LOVE));
        return response;
    }
    public List<PostResponse> getPosts(){
        return postMapper.toListResponse(postRepository.findAll());
    }

    public List<PostResponse> getPostsByUserId(UUID userId){
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        List<Post> posts = postRepository.findPostByOwnerId(userId);
        return posts.stream()
                .map(postMapper::toResponse)
                .toList();
    }

//    public PageResponse<PostResponse> getPostsByUserIdPage(UUID userId, int page, int size){
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//        Page<Post> postPage = postRepository.findAllByOwnerId(userId, pageable);
//        return PageResponse.<PostResponse>builder()
//                .currentPage(page + 1)
//                .totalPages(postPage.getTotalPages())
//                .pageSize(postPage.getSize())
//                .totalElements(postPage.getTotalElements())
//                .data(postPage.getContent().stream()
//                        .map(postMapper::toResponse)
//                        .toList())
//                .build();
//    }

    public PageResponse<PostResponse> getPostsByUserIdPage(UUID targetUserId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> postPage = postRepository.findByOwnerId(targetUserId, pageable);

        List<PostResponse> responses = postPage.getContent().stream()
                .map(postMapper::toResponse)
                .collect(Collectors.toList());
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        List<UUID> postIds = responses.stream().map(PostResponse::getId).collect(Collectors.toList());

        if (!postIds.isEmpty()) {
            List<Reaction> userReactions = reactionRepository.findByUserIdAndPostIdIn(currentUserId, postIds);

            Map<UUID, ReactionType> reactionMap = userReactions.stream()
                    .collect(Collectors.toMap(r -> r.getPost().getId(), Reaction::getType));

            responses.forEach(res -> {
                ReactionType rt = reactionMap.get(res.getId());
                if (rt != null) {
                    res.setCurrentReaction(ReactionType.LOVE);
                }
            });
        }

        return PageResponse.<PostResponse>builder()
                .currentPage(page + 1)
                .totalPages(postPage.getTotalPages())
                .pageSize(postPage.getSize())
                .totalElements(postPage.getTotalElements())
                .data(responses)
                .build();
    }

    public PageResponse<PostResponse> getFeedPostsPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        // fetch all posts that have no TTL or haven't expired yet
        Page<Post> postPage = postRepository.findByExpiresAtIsNullOrExpiresAtAfter(LocalDateTime.now(), pageable);
        List<PostResponse> responses = postPage.getContent().stream()
                .map(postMapper::toResponse)
                .collect(Collectors.toList());

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        List<UUID> postIds = responses.stream().map(PostResponse::getId).collect(Collectors.toList());

        if (!postIds.isEmpty()) {
            List<Reaction> userReactions = reactionRepository.findByUserIdAndPostIdIn(currentUserId, postIds);
            Map<UUID, ReactionType> reactionMap = userReactions.stream()
                    .collect(Collectors.toMap(r -> r.getPost().getId(), Reaction::getType));
            responses.forEach(res -> {
                ReactionType rt = reactionMap.get(res.getId());
                if (rt != null) {
                    res.setCurrentReaction(ReactionType.LOVE);
                }
            });
        }

        return PageResponse.<PostResponse>builder()
                .currentPage(page + 1)
                .totalPages(postPage.getTotalPages())
                .pageSize(postPage.getSize())
                .totalElements(postPage.getTotalElements())
                .data(responses)
                .build();
    }
}
