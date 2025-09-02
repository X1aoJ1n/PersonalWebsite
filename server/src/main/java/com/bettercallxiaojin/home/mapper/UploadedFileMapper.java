package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.UploadedFile;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface UploadedFileMapper {
    @Insert("INSERT INTO uploaded_file(file_url, category, created_at, file_name) " +
            "VALUES(#{fileUrl}, #{category}, #{createdAt}, #{fileName})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(UploadedFile uploadedFile);
}
