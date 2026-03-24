package com.eiu.testlab.fade.controller;

import com.eiu.testlab.fade.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {
    private final FileService fileService;
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam("folder") String folder
    ) throws IOException {
        String path = fileService.uploadFile(file, folder);
        return ResponseEntity.ok(path);
    }

}
