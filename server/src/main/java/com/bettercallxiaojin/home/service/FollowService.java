package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;

import java.util.List;

public interface FollowService {
    void follow(String followId);

    void unfollow(String followId);

    Boolean checkFollowStatus(String followId);

    List<SimpleUserVO> getFollowingList(String pageNum, String pageSize);

    List<SimpleUserVO> getFollowerList(String pageNum, String pageSize);
}
