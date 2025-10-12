package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.Comment;
import com.bettercallxiaojin.home.pojo.entity.Post;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {

    @Insert("INSERT INTO comment (id, user_id, post_id, content, like_count, created_at, updated_at, status) " +
            "VALUES (#{id}, #{userId}, #{postId}, #{content}, #{likeCount}, #{createdAt}, #{updatedAt}, #{status})")
    int insert(Comment comment);

    @Select("SELECT * FROM comment WHERE id = #{id}")
    Comment selectById(String id);

    @Update("UPDATE comment SET content = #{content}, updated_at = #{updatedAt} WHERE id = #{id}")
    int update(Comment comment);

    @Update("UPDATE comment SET like_count = like_count + #{increment} WHERE id = #{id}")
    int updateLikeCount(@Param("id") String id, @Param("increment") Integer increment);

    @Update("UPDATE comment SET status = #{status} WHERE id = #{commentId}")
    int updateStatus(String commentId, Integer status);

    @Select("SELECT * FROM comment WHERE post_id = #{postId} ORDER BY like_count DESC, create_at DESC LIMIT #{pageSize} OFFSET #{offset}")
    List<Comment> selectByPostId(@Param("postId") String id,
                                 @Param("pageSize") int pageSize,
                                 @Param("offset") int offset);
}
