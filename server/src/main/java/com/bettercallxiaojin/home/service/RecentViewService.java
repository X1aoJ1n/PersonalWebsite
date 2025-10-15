package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.SimplePostVO;
import com.bettercallxiaojin.home.pojo.VO.UserPreviewVO;

import java.util.List;

public interface RecentViewService {
    List<SimplePostVO> getRecentViewPost(Integer pageNum, Integer pageSize);

    List<UserPreviewVO> getRecentViewUser(Integer pageNum, Integer pageSize);

    void insertPost(String targetId);

    void insertUser(String targetId);
}
