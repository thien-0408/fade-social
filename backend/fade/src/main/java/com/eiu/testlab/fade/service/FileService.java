package com.eiu.testlab.fade.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file, String folder) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("You selected an empty file!");
        }

        Path folderPath = Paths.get(uploadDir, folder);

        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
        }

        String fileName = UUID.randomUUID()
                + getFileExtension(file.getOriginalFilename());

        Path filePath = folderPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + folder + "/" + fileName;
    }
    public void deleteFile(String path) {
        if (path == null || path.isBlank()) return;

        try {
            String relativePath = path.replace("/uploads/", "");
            Path filePath = Paths.get(uploadDir, relativePath);

            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null) return "";
        return filename.substring(filename.lastIndexOf("."));
    }

}
