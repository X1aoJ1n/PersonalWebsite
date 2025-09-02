package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.pojo.entity.UploadedFile;
import com.bettercallxiaojin.home.mapper.UploadedFileMapper;
import com.bettercallxiaojin.home.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    @Value("${bettercallxiaojin.file.upload-dir}")
    private String uploadDir;

    @Value("${bettercallxiaojin.file.filePrefix}")
    private String filePrefix;

    private final UploadedFileMapper uploadedFileMapper;

    @Override
    public UploadedFile uploadFile(MultipartFile file, String category) throws IOException {
        String fileName = file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        Files.createDirectories(filePath.getParent());
        file.transferTo(filePath.toFile());

        UploadedFile uploadedFile = new UploadedFile();
        uploadedFile.setFileName(fileName);
        uploadedFile.setFileUrl(filePrefix + "/files/" + fileName);
        uploadedFile.setCategory(category);
        uploadedFile.setCreatedAt(LocalDateTime.now());
        uploadedFileMapper.insert(uploadedFile);

        return uploadedFile;
    }
}
