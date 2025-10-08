package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.Comment;
import com.bettercallxiaojin.home.pojo.entity.Reply;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

public interface ReplyMapper {

    @Insert("INSERT INTO reply (id, user_id, comment_id, content, like_count, created_at, updated_at, status, reply_to) " +
            "VALUES (#{id}, #{userId}, #{commentId}, #{content}, #{likeCount}, #{createdAt}, #{updatedAt}, #{status}, #{replyTo})")
    int insert(Reply reply);

    @Select("SELECT user_id FROM reply WHERE id = #{id}")
    String selectUserById(String id);

    @Select("SELECT * FROM reply WHERE id = #{id}")
    Reply selectById(String id);

    @Update("UPDATE reply SET content = #{content}, updated_at = #{updatedAt} WHERE id = #{id}")
    int update(String content, LocalDateTime updatedAt, String id);

    @Update("UPDATE reply SET status = #{status} WHERE id = #{id}")
    int updateStatus(String id, Integer status);

    @Select("SELECT * FROM reply WHERE comment_id = #{id} ORDER BY create_at DESC LIMIT #{pageSize} OFFSET #{offset}")
    List<Reply> selectByCommentId(@Param("commentId") String id,
                                 @Param("pageSize") int pageSize,
                                 @Param("offset") int offset);
}
