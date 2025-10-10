package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.Organization;
import org.apache.ibatis.annotations.*;

@Mapper
public interface LikeMapper {
    @Insert("INSERT INTO like_record (user_id, target_id, target_type) " +
            "VALUES (#{userId}, #{targetId}, #{targetType})")
    int insert(String userId, String targetId, Integer targetType);

    @Delete("DELETE FROM like_record WHERE user_id = #{userId} AND target_type = #{targetType} AND target_id = #{targetId}")
    int delete(String userId, String targetId, Integer targetType);

    @Select("SELECT COUNT(*) FROM like_record WHERE user_id = #{userId} AND target_id = #{targetId} AND target_type = #{targetType}")
    int selectLikeRecord(String userId, String targetId, Integer targetType);
}
