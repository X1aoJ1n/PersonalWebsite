package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.VO.PostVO;
import com.bettercallxiaojin.home.pojo.entity.Post;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PostMapper {

    @Insert("INSERT INTO post (id, user_id, title, content, like_count, comment_count, created_at, updated_at) " +
            "VALUES (#{id}, #{userId}, #{title}, #{content}, #{likeCount}, #{commentCount}, #{createdAt}, #{updatedAt})")
    int insert(Post post);

    @Select("SELECT * FROM post WHERE id = #{id}")
    Post selectById(String id);

    @Update("UPDATE post SET title = #{title}, content = #{content}, preview = #{preview}, updated_at = #{updatedAt} WHERE id = #{id}")
    int update(Post post);

    @Delete("DELETE FROM post WHERE id = #{id}")
    int deleteById(String id);

    @Select("SELECT p.id, p.title, p.content, p.like_count, p.comment_count, " +
            "p.created_at, p.updated_at, " +
            "u.id AS userVO_id, u.username AS userVO_username " +
            "FROM post p " +
            "JOIN user_db u ON p.user_id = u.id " +
            "WHERE p.user_id = #{userId} " +
            "ORDER BY p.created_at DESC " +
            "LIMIT #{pageSize} OFFSET #{offset}")
    List<PostVO> selectByUserId(@Param("userId") String userId,
                                        @Param("offset") int offset,
                                        @Param("pageSize") int pageSize);

    @Select("SELECT p.id, p.title, p.content, p.like_count, p.comment_count, " +
            "p.created_at, p.updated_at, " +
            "u.id AS userVO_id, u.username AS userVO_username " +
            "FROM post p " +
            "JOIN user_db u ON p.user_id = u.id " +
            "WHERE p.user_id = #{userId} " +
            "ORDER BY p.created_at DESC " +
            "LIMIT #{pageSize} OFFSET #{offset}")
    List<PostVO> selectAll(Integer pageNum, Integer pageSize);
}
