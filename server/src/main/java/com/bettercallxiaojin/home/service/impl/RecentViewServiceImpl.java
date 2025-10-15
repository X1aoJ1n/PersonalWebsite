package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.common.Constant.RecentViewConstant;
import com.bettercallxiaojin.home.mapper.RecentViewMapper;
import com.bettercallxiaojin.home.pojo.VO.SimplePostVO;
import com.bettercallxiaojin.home.pojo.VO.UserPreviewVO;
import com.bettercallxiaojin.home.service.PostService;
import com.bettercallxiaojin.home.service.RecentViewService;
import com.bettercallxiaojin.home.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecentViewServiceImpl implements RecentViewService {

    private final RecentViewMapper recentViewMapper;
    private final PostService postService;
    private final UserService userService;


    @Override
    public List<SimplePostVO> getRecentViewPost(Integer pageNum, Integer pageSize) {

        List<String> postIds = recentViewMapper.selectByUserId(
                BaseContext.getUserId(),
                RecentViewConstant.POST,
                pageSize,
                (pageNum - 1) * pageSize);

        return postService.getBatchPost(postIds);
    }

    @Override
    public List<UserPreviewVO> getRecentViewUser(Integer pageNum, Integer pageSize) {
        List<String> userIds = recentViewMapper.selectByUserId(
                BaseContext.getUserId(),
                RecentViewConstant.USER,
                pageSize,
                (pageNum - 1) * pageSize);
        return userService.getBatchUser(userIds);
    }

    @Override
    public void insertPost(String targetId) {
        String userId = BaseContext.getUserId();

        String id = UUID.randomUUID().toString();

        recentViewMapper.insertOrUpdatePost(id, userId, targetId);
    }

    @Override
    public void insertUser(String targetId) {
        String userId = BaseContext.getUserId();

        if (userId.equals(targetId)) {
            return;
        }
        String id = UUID.randomUUID().toString();

        recentViewMapper.insertOrUpdateUser(id, userId, targetId);
    }
}
