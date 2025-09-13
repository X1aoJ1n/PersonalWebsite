package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user_db WHERE email = #{email}")
    User selectByEmail(String email);

    @Insert("INSERT INTO user_db (id, email, password, username, create_time, update_time, follower_count, following_count) " +
            "VALUES(#{id}, #{email}, #{password}, #{username}, #{createTime}, #{updateTime}, #{followerCount}, #{followingCount})")
    int insert(User user);

    @Select("SELECT * FROM user_db WHERE id = #{id}")
    User selectById(String id);

    @Update("UPDATE user_db set password = #{encodePassword} WHERE id = #{userId}")
    void updatePassword(String userId, String encodePassword);

    @Update("UPDATE user_db set username = #{username}, introduction = #{introduction} WHERE id = #{id}")
    void updateUserById(User user);

    @Update("UPDATE user_db set follower_count = #{followerCount} WHERE id = #{userId}")
    void updateFollower(Integer followerCount, String userId);

    @Update("UPDATE user_db set following_count = #{followingCount} WHERE id = #{userId}")
    void updateFollowing(Integer followingCount, String userId);

    @Update("UPDATE user_db set email = #{email} WHERE id = #{userId}")
    void updateEmail(String userId, String email);

    @Update("UPDATE user_db set icon = #{iconUrl} WHERE id = #{userId}")
    void updateIcon(String userId, String iconUrl);
}
