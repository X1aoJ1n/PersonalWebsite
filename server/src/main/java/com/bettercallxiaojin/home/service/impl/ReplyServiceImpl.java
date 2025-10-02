package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.pojo.VO.ReplyVO;
import com.bettercallxiaojin.home.service.ReplyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReplyServiceImpl implements ReplyService {
    @Override
    public ReplyVO createReply(String commentId, String replyTo, String content) {
        return null;
    }

    @Override
    public Boolean deleteReply(String id) {
        return null;
    }

    @Override
    public ReplyVO updateReply(String id, String content) {
        return null;
    }

    @Override
    public List<ReplyVO> getRepliesByPostId(String id, Integer pageNum, Integer pageSize) {
        return List.of();
    }

    @Override
    public List<ReplyVO> getOverviewReplies(String commentId) {
        return List.of();
    }
}
