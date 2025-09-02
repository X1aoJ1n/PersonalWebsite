package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.UploadedFile;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UploadedFileMapper {
    @Insert("INSERT INTO uploaded_file(id, file_url, category, created_at, file_name) " +
            "VALUES(#{id}, #{fileUrl}, #{category}, #{createdAt}, #{fileName})")
    int insert(UploadedFile uploadedFile);

    @Select("SELECT * FROM uploaded_file WHERE id = #{id}")
    UploadedFile selectById(String id);

    @Select("SELECT * FROM uploaded_file WHERE file_url = #{fileUrl}")
    UploadedFile selectByUrl(String fileUrl);

    @Delete("DELETE FROM uploaded_file WHERE id = #{id}")
    void deleteFilebyId(String id);
}
