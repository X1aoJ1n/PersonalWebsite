package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FollowMapper {
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
