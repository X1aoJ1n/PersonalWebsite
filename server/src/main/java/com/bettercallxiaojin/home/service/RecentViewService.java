package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.SimplePostVO;
import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.pojo.VO.UserPreviewVO;

import java.util.List;

public interface RecentViewService {
    List<SimplePostVO> getRecentViewPost(Integer pageNum, Integer pageSize);

    List<SimpleUserVO> getRecentViewUser(Integer pageNum, Integer pageSize);

    void insertPost(String targetId);

    void insertUser(String targetId);
}
