package com.bettercallxiaojin.home.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RecentViewMapper {


    @Select("SELECT target_id FROM recent_view WHERE user_id = #{userId} AND type = #{type}" +
            " ORDER BY viewed_at DESC LIMIT #{pageSize} OFFSET #{offset}")
    List<String> selectByUserId(String userId, Integer type, int pageSize, int offset);

    @Insert({
            "INSERT INTO recent_view (id, user_id, target_id, type, viewed_at)",
            "VALUES (#{id}, #{userId}, #{targetId}, 1, NOW())",
            "ON CONFLICT (user_id, target_id, type) DO UPDATE",
            "SET viewed_at = NOW()"
    })
    void insertOrUpdatePost(@Param("id") String id,
                                @Param("userId") String userId,
                                @Param("targetId") String targetId);

    @Insert({
            "INSERT INTO recent_view (id, user_id, target_id, type, viewed_at)",
            "VALUES (#{id}, #{userId}, #{targetId}, 2, NOW())",
            "ON CONFLICT (user_id, target_id, type) DO UPDATE",
            "SET viewed_at = NOW()"
    })
    void insertOrUpdateUser(@Param("id") String id,
                            @Param("userId") String userId,
                            @Param("targetId") String targetId);

}
