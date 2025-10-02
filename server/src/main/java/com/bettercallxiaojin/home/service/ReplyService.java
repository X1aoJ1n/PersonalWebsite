package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.ReplyVO;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public interface ReplyService {
    ReplyVO createReply(@NotBlank(message = "postId cannot be null") String commentId, String replyTo, @NotBlank(message = "content cannot be null") String content);

    Boolean deleteReply(String id);

    ReplyVO updateReply(@NotBlank(message = "id cannot be null") String id, @NotBlank(message = "content cannot be null") String content);

    List<ReplyVO> getRepliesByPostId(String id, Integer pageNum, Integer pageSize);

    List<ReplyVO> getOverviewReplies(String commentId);
}
