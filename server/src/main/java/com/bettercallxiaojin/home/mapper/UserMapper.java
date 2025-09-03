package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user_db WHERE email = #{email}")
    User selectByEmail(String email);

    @Insert("INSERT INTO user_db (id, email, password, username, create_time, update_time) " +
            "VALUES(#{id}, #{email}, #{password}, #{username}, #{createTime}, #{updateTime})")
    int insert(User user);

    @Select("SELECT * FROM user_db WHERE id = #{id}")
    User selectById(String id);

    @Update("UPDATE user_db set password = #{encodePassword} WHERE id = #{userId}")
    void updatePassword(String userId, String encodePassword);

    @Update("UPDATE user_db set username = #{username}, introduction = #{introduction} WHERE id = #{userId}")
    void updateUserById(String userId, String username, String introduction);
}
