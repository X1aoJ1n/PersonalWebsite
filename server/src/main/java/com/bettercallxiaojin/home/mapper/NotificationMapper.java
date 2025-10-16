package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.Notification;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface NotificationMapper {

    @Insert("INSERT INTO notification (id, user_id, \"read\", type, created_at, target_user_id, target_id, target_type, target_content, content, post_id) " +
            "VALUES (#{id}, #{userId}, #{read}, #{type}, #{createdAt}, #{targetUserId}, #{targetId}, #{targetType}, #{targetContent}, #{content}, #{postId})")
    int insert(Notification notification);

    @Update("UPDATE notification SET \"read\" = TRUE WHERE id =#{id}")
    int updateRead(String id);

    @Update("UPDATE notification SET  \"read\" = TRUE WHERE user_id = #{userId} AND type = #{type}")
    int updateReadBatch(String userId, Integer type);

    @Delete("DELETE FROM notification WHERE target_user_id = #{targetUserId} AND target_id = #{targetId} AND target_type = #{targetType} AND type = #{type}")
    int deleteLike(@Param("targetUserId") String targetUserId, @Param("targetId") String targetId, @Param("targetType") Integer targetType, @Param("type") Integer type);

    @Delete("DELETE FROM notification WHERE target_user_id = #{targetUserId} AND user_id = #{userId} AND type = #{type}")
    int deleteFollow(@Param("targetUserId") String targetUserId, @Param("userId") String userId, @Param("type") Integer type);

    @Select("SELECT * FROM notification WHERE user_id = #{userId} AND type = #{type} ORDER BY created_at DESC")
    List<Notification> selectByUserAndType(@Param("userId") String userId, @Param("type") Integer type);

    @Select("SELECT * FROM notification WHERE user_id = #{userId} AND type IN (#{type1}, #{type2}) ORDER BY created_at DESC")
    List<Notification> selectByUserAndTypes(@Param("userId") String userId,
                                            @Param("type1") Integer type1,
                                            @Param("type2") Integer type2);

    @Select("SELECT COUNT(*) FROM notification WHERE read = false AND user_id = #{userId}")
    Integer countAllUnread(@Param("userId") String userId);

    @Select("SELECT COUNT(*) FROM notification WHERE read = false AND type = #{type} AND user_id = #{userId}")
    Integer countUnreadByType(@Param("userId") String userId, @Param("type") Integer type);
}