package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.mapper.CommentMapper;
import com.bettercallxiaojin.home.mapper.LikeMapper;
import com.bettercallxiaojin.home.mapper.PostMapper;
import com.bettercallxiaojin.home.mapper.ReplyMapper;
import com.bettercallxiaojin.home.service.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeMapper likeMapper;
    private final PostMapper postMapper;
    private final CommentMapper commentMapper;
    private final ReplyMapper replyMapper;

    @Override
    public Boolean like(Integer targetType, String targetId) {
        String userId = BaseContext.getUserId();

        if (checkLikeStatus(targetType, targetId)) {
            throw new RuntimeException("already liked");
        }

        try {
            if (targetType == 1) {
                postMapper.updateLikeCount(targetId, 1);
            } else if (targetType == 2) {
                commentMapper.updateLikeCount(targetId, 1);
            } else if (targetType == 3) {
                replyMapper.updateLikeCount(targetId, 1);
            }
        } catch (Exception e){
            throw new RuntimeException("update like count error" + e.getMessage());
        }

        int rows = 0;
        try {
            rows = likeMapper.insert(userId, targetId, targetType);
        } catch (Exception e) {
            throw new RuntimeException("like error: " + e.getMessage());
        }
        return rows > 0;
    }

    @Override
    public Boolean unlike(Integer targetType, String targetId) {
        String userId = BaseContext.getUserId();

        if (!checkLikeStatus(targetType, targetId)) {
            throw new RuntimeException("not liked");
        }

        try {
            if (targetType == 1) {
                postMapper.updateLikeCount(targetId, -1);
            } else if (targetType == 2) {
                commentMapper.updateLikeCount(targetId, -1);
            } else if (targetType == 3) {
                replyMapper.updateLikeCount(targetId, -1);
            }
        } catch (Exception e){
            throw new RuntimeException("update like count error" + e.getMessage());
        }

        int rows = 0;
        try {
            rows = likeMapper.delete(userId, targetId, targetType);
        } catch (Exception e) {
            throw new RuntimeException("like error: " + e.getMessage());
        }
        return rows > 0;
    }


    @Override
    public Boolean checkLikeStatus(Integer targetType, String targetId) {
        String userId = BaseContext.getUserId();

        if (userId == null || userId.isEmpty()) {
            return false;
        }

        try {
            return (likeMapper.selectLikeRecord(userId, targetId, targetType)>0);
        } catch (Exception e) {
            throw new RuntimeException("like error: " + e.getMessage());
        }
    }
}
