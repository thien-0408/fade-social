package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.dto.ApiResponse;
import com.eiu.testlab.fade.dto.Comment.CommentRequest;
import com.eiu.testlab.fade.dto.Comment.CommentResponse;
import com.eiu.testlab.fade.dto.PageResponse;
import com.eiu.testlab.fade.service.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RequestMapping("api/comments")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {
    CommentService commentService;

    @PostMapping("{postId}")
    public ApiResponse<CommentResponse> addComment(@PathVariable UUID postId, @RequestBody CommentRequest request){
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.addComment(postId, request))
                .message("Comment added.")
                .build();
    }

    @GetMapping("{postId}")
    public ApiResponse<PageResponse<CommentResponse>> getComments(
            @PathVariable UUID postId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .result(commentService.getCommentsByPostId(postId, page - 1, size))
                .message("Get comments successfully")
                .build();
    }
}
