package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE email = #{email}")
    User selectByEmail(String email);

    @Insert("INSERT INTO users (id, email, password, username, create_time, update_time) " +
            "VALUES(#{id}, #{email}, #{password}, #{username}, #{createTime}, #{updateTime})")
    int insert(User user);
}
