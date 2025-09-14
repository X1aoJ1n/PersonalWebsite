package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.Comment;
import com.bettercallxiaojin.home.pojo.entity.Post;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {

    @Insert("INSERT INTO comment (id, user_id, post_id, content, like_count, created_at, updated_at) " +
            "VALUES (#{id}, #{userId}, #{postId}, #{content}, #{likeCount}, #{createdAt}, #{updatedAt})")
    int insert(Comment comment);

    @Select("SELECT * FROM comment WHERE id = #{id}")
    Comment selectById(String id);

    @Update("UPDATE comment SET content = #{content}, updated_at = #{updatedAt} WHERE id = #{id}")
    int update(Comment comment);

    @Delete("DELETE FROM comment WHERE id = #{id}")
    int deleteById(String id);

    @Select("SELECT * FROM comment WHERE post_id = #{id} ORDER BY like_count DESC LIMIT #{pageSize} OFFSET #{offset}")
    List<Comment> selectByPostId(@Param("postId") String id,
                                 @Param("pageSize") int pageSize,
                                 @Param("offset") int offset);
}
