package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.Contact;
import com.bettercallxiaojin.home.pojo.entity.Organization;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ContactMapper {

    @Select("SELECT * FROM contact WHERE user_id = #{userId}")
    List<Contact> selectByUserId(@Param("userId") String userId);

    @Select("SELECT * FROM contact WHERE id = #{id}")
    Contact selectById(String id);

    @Insert("INSERT INTO contact (id, user_id, type, data) " +
            "VALUES (#{id}, #{userId}, #{type}, #{data})")
    int insert(Contact contact);

    @Update("UPDATE contact set type = #{type}, data = #{data} WHERE id = #{id}")
    int update(Contact contact);

    @Delete("DELETE FROM contact WHERE id = #{id}")
    void deleteById(String id);
}
