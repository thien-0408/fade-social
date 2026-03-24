package com.eiu.testlab.fade.dto.Post;

import com.eiu.testlab.fade.enums.PostType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PostCreationRequest {
    @NotNull(message = "Post type is required")
    private PostType type;
    private String content;
    private MultipartFile mediaFile;
    @Min(value = 0, message = "TTL must be 0 or greater")
    private int ttlMinutes; // = 0 -> permanent
}
