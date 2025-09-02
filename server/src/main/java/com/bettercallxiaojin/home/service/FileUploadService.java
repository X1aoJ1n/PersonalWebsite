package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.entity.UploadedFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {
    UploadedFile uploadFile(MultipartFile file, String category) throws IOException;

    void deleteFileByUrl(String fileUrl) throws IOException;
}
