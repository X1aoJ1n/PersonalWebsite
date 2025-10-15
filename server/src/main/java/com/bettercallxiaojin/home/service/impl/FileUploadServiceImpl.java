package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.pojo.entity.UploadedFile;
import com.bettercallxiaojin.home.mapper.UploadedFileMapper;
import com.bettercallxiaojin.home.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

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

        long maxSize = 30 * 1024 * 1024; // 30 MB
        if (file.getSize() > maxSize) {
            throw new IOException("文件大小不能超过30MB");
        }

        String originalFileName = file.getOriginalFilename();
        String fileName = originalFileName; // 临时变量用于动态修改
        Path filePath = Paths.get(uploadDir, fileName);

        int count = 1;
        while (Files.exists(filePath)) {
            String name = originalFileName.substring(0, originalFileName.lastIndexOf("."));
            String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
            fileName = name + "(" + count + ")" + ext;
            filePath = Paths.get(uploadDir, fileName);
            count++;
        }

        Files.createDirectories(filePath.getParent());
        file.transferTo(filePath.toFile());

        UploadedFile uploadedFile = new UploadedFile();

        String fileId = UUID.randomUUID().toString();

        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");
        uploadedFile.setFileUrl(filePrefix + "/files/" + encodedFileName);

        uploadedFile.setId(fileId);
        uploadedFile.setFileName(fileName);
        uploadedFile.setCategory(category);
        uploadedFile.setCreatedAt(LocalDateTime.now());
        uploadedFileMapper.insert(uploadedFile);

        return uploadedFile;
    }


    @Override
    public void deleteFileByUrl(String fileUrl) {
        try {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

            Path filePath = Paths.get(uploadDir, fileName);

            Files.deleteIfExists(filePath);


            UploadedFile uploadedFile = uploadedFileMapper.selectByUrl(fileUrl);

            if (uploadedFile == null) {
                throw new RuntimeException("url对应的文件不存在");
            }
            String fileId = uploadedFile.getId();

            uploadedFileMapper.deleteFilebyId(fileId);

        } catch (IOException e) {
            log.error("删除文件失败: {}", fileUrl, e);
        }
    }


}
