package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.service.FollowService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowServiceImpl implements FollowService {
    @Override
    public void follow(String followId) {

    }

    @Override
    public void unfollow(String followId) {

    }

    @Override
    public void checkFollowStatus(String followId) {

    }

    @Override
    public List<SimpleUserVO> getFollowingList(String pageNum, String pageSize) {
        return List.of();
    }

    @Override
    public List<SimpleUserVO> getFollowerList(String pageNum, String pageSize) {
        return List.of();
    }
}
