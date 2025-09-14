package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.VO.PostVO;
import com.bettercallxiaojin.home.pojo.VO.SimplePostVO;
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

    @Select("SELECT * FROM post WHERE user_id = #{userId} ORDER BY created_at DESC LIMIT #{pageSize} OFFSET #{offset}")
    List<Post> selectByUserId(@Param("userId") String userId,
                              @Param("pageSize") int pageSize,
                              @Param("offset") int offset);

    @Select("SELECT * FROM post ORDER BY created_at DESC LIMIT #{pageSize} OFFSET #{offset}")
    List<Post> selectAll(@Param("pageSize") int pageSize,
                         @Param("offset") int offset);

    @Select({
            "<script>",
            "SELECT id, user_id AS userId, title, like_count AS likeCount, comment_count AS commentCount, created_at AS createdAt ",
            "FROM post ",
            "WHERE user_id IN ",
            "<foreach collection='userIds' item='id' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "ORDER BY created_at DESC ",
            "LIMIT #{pageSize} OFFSET #{offset}",
            "</script>"
    })
    List<Post> selectByUserIds(@Param("userIds") List<String> userIds,
                              @Param("pageSize") int pageSize,
                              @Param("offset") int offset);
}
