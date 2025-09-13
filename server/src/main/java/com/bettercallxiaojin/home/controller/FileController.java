package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.pojo.entity.UploadedFile;
import com.bettercallxiaojin.home.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
@Tag(name = "文件管理", description = "文件上传删除相关接口")
public class FileController {

    private final FileUploadService fileUploadService;


    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "上传文件")
    public Response<UploadedFile> uploadFile(
            @Parameter(description = "要上传的文件")
            @RequestPart("file") MultipartFile file,

            @Parameter(description = "文件类别")
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
    @Operation(summary = "使用Url删除文件")
    public Response<UploadedFile> uploadFile(@RequestParam("fileUrl") String fileUrl) {
        try {

            fileUploadService.deleteFileByUrl(fileUrl);

            return Response.success();

        } catch (IOException e) {
            return Response.error("上传失败：" + e.getMessage());
        }
    }
}
