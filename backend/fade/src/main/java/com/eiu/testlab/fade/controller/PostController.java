package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.ApiResponse;
import com.eiu.testlab.fade.dto.PageResponse;
import com.eiu.testlab.fade.dto.Post.PostCreationRequest;
import com.eiu.testlab.fade.dto.Post.PostResponse;
import com.eiu.testlab.fade.enums.PostType;
import com.eiu.testlab.fade.service.PostService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/posts")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class PostController {
    PostService postService;

    @PostMapping(value = "upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<PostResponse> uploadPost(
            @RequestParam("type") PostType type,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile,
            @RequestParam(value = "ttlMinutes", required = false) Integer ttlMinutes
    ) {
        PostCreationRequest request = new PostCreationRequest();
        request.setType(type);
        request.setContent(content);
        request.setMediaFile(mediaFile);
        request.setTtlMinutes(ttlMinutes != null ? ttlMinutes : 0);

        PostResponse response = postService.createPost(request);
        return ApiResponse.<PostResponse>builder()
                .result(response)
                .message("Post created")
                .build();
    }

    @GetMapping("feed")
    public ApiResponse<PageResponse<PostResponse>> getFeedPosts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        var result = postService.getFeedPostsPage(page - 1, size);
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .message("Get feed posts successfully")
                .result(result)
                .build();
    }

    @GetMapping("{userId}")
    public ApiResponse<List<PostResponse>> getPosts(@PathVariable UUID userId){
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getPostsByUserId(userId))
                .message("Success").build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<PageResponse<PostResponse>> getPostsByUserId(
            @PathVariable UUID userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        var result = postService.getPostsByUserIdPage(userId, page - 1, size);
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .message("Get posts successfully")
                .result(result)
                .build();
    }
    @GetMapping("/post/{postId}")
    public ApiResponse<PostResponse> getPostById(@PathVariable UUID postId){
        return ApiResponse.<PostResponse>builder()
                .result(postService.getPost(postId))
                .message("Success")
                .build();
    }

    @PreAuthorize("hasRole('ADMIN') || hasRole('USER')")
    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<PostResponse> updatePost(
            @PathVariable UUID postId,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile
    ) {
        PostResponse response = postService.updatePost(postId, content, mediaFile);
        return ApiResponse.<PostResponse>builder()
                .result(response)
                .message("Post updated")
                .build();
    }

    @PreAuthorize("hasRole('ADMIN') || hasRole('USER')")
    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable UUID postId){
        postService.deletePost(postId);
        return ApiResponse.<Void>builder()
                .message("Post deleted.").build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("get-all")
    public ApiResponse<List<PostResponse>> getAllPost(){
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getPosts()).build();
    }
}
