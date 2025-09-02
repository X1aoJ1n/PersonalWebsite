package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.Contact;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ContactMapper {

    @Select("SELECT * FROM contact WHERE user_id = #{userId}")
    List<Contact> selectByUserId(@Param("userId") String userId);
}
