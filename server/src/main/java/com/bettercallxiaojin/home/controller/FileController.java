package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.pojo.entity.UploadedFile;
import com.bettercallxiaojin.home.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final FileUploadService fileUploadService;


    @PostMapping("/upload")
    public Response<UploadedFile> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category
    ) {
        try {

            UploadedFile uploadedFile = fileUploadService.uploadFile(file, category);

            return Response.success(uploadedFile);

        } catch (IOException e) {
            return Response.error("上传失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public Response<UploadedFile> uploadFile(@RequestParam("fileUrl") String fileUrl) {
        try {

            fileUploadService.deleteFileByUrl(fileUrl);

            return Response.success();

        } catch (IOException e) {
            return Response.error("上传失败：" + e.getMessage());
        }
    }
}
