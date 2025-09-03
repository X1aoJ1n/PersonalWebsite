package com.bettercallxiaojin.home.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UploadedFile {

    private String id;

    private String fileUrl;

    private String category;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String fileName;
}