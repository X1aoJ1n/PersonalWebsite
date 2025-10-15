package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.pojo.VO.UserPreviewVO;
import com.bettercallxiaojin.home.pojo.entity.Post;
import com.bettercallxiaojin.home.pojo.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user_db WHERE email = #{email}")
    User selectByEmail(String email);

    @Select("SELECT username FROM user_db WHERE id = #{id}")
    String selectNameById(String id);

    @Insert("INSERT INTO user_db (id, email, password, username, create_time, update_time, follower_count, following_count, like_count) " +
            "VALUES(#{id}, #{email}, #{password}, #{username}, #{createTime}, #{updateTime}, #{followerCount}, #{followingCount}, #{likeCount})")
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

    @Update("UPDATE user_db set like_count = like_count + #{i} WHERE id = #{userId}")
    void updateLikeCount(Integer i, String userId);

    @Update("UPDATE user_db set email = #{email} WHERE id = #{userId}")
    void updateEmail(String userId, String email);

    @Update("UPDATE user_db set icon = #{iconUrl} WHERE id = #{userId}")
    void updateIcon(String userId, String iconUrl);

    @Select({
            "<script>",
            "SELECT * FROM user_db",
            "<if test='userIds != null and userIds.size() > 0'>",
            "WHERE id IN",
            "<foreach item='id' collection='userIds' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</if>",
            "</script>"
    })
    List<SimpleUserVO> selectSimpleUsersByIds(@Param("userIds") List<String> userIds);

    @Update("UPDATE user_db set background = #{backgroundUrl} WHERE id = #{userId}")
    void updateBackground(String userId, String backgroundUrl);
}
