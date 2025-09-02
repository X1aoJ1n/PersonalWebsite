package com.bettercallxiaojin.home.pojo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UploadedFile {

    private String id;

    private String fileUrl;

    private String category;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String fileName;
}