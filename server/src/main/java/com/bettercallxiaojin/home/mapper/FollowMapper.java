package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FollowMapper {


    @Select("SELECT CASE WHEN EXISTS (SELECT 1 FROM follow WHERE user_id = #{userId} AND follow_id = #{followId}) THEN TRUE ELSE FALSE END")
    boolean existsByUserIdAndFollowId(String userId, String followId);

    @Insert("INSERT INTO follow (user_id, follow_id) VALUES(#{userId}, #{followId})")
    void follow(String userId, String followId);

    @Delete("DELETE from follow WHERE user_id = #{userId} AND follow_id = #{followId}")
    void unfollow(String userId, String followId);

    @Select("SELECT u.id, u.username " +
            "FROM follow f " +
            "JOIN user_db u ON f.follow_id = u.id " +
            "WHERE f.user_id = #{userId}")
    List<SimpleUserVO> selectFollowingByUserId(String userId);

    @Select("SELECT u.id, u.username " +
            "FROM follow f " +
            "JOIN user_db u ON f.user_id = u.id " +
            "WHERE f.follow_id = #{userId}")
    List<SimpleUserVO> selectFollowerByUserId(String userId);

}
