package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.CommentVO;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public interface CommentService {
    CommentVO createComment(@NotBlank(message = "postId cannot be null") String postId, @NotBlank(message = "content cannot be null") String content);

    Boolean deleteComment(String id);

    List<CommentVO> getCommentsByPostId(String id, Integer pageNum, Integer pageSize);

    CommentVO updateComment(@NotBlank(message = "id cannot be null") String id, @NotBlank(message = "content cannot be null") String content);
}
