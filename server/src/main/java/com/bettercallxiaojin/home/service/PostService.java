package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.PostVO;
import com.bettercallxiaojin.home.pojo.VO.SimplePostVO;
import com.bettercallxiaojin.home.pojo.entity.Response;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public interface PostService {
    PostVO createPost(String title, String preview, String content);

    PostVO updatePost(String id, String title, String preview, String content);
    
    Boolean deletePostById(String id);

    PostVO getPostById(String id);

    List<SimplePostVO> getUserPost(String userId, Integer pageNum, Integer pageSize);

    List<SimplePostVO> getVisiblePost(Integer pageNum, Integer pageSize);

    List<SimplePostVO> getFavoritePost(Integer pageNum, Integer pageSize);

    List<SimplePostVO> getFollowPost(Integer pageNum, Integer pageSize);
}
