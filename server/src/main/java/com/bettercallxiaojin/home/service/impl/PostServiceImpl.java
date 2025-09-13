package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.mapper.PostMapper;
import com.bettercallxiaojin.home.mapper.UserMapper;
import com.bettercallxiaojin.home.pojo.VO.PostVO;
import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.pojo.entity.Post;
import com.bettercallxiaojin.home.service.LikeService;
import com.bettercallxiaojin.home.service.PostService;
import com.bettercallxiaojin.home.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final UserService userService;
    private final LikeService likeService;

    @Override
    public PostVO createPost(String title, String preview, String content) {
        String userId = BaseContext.getUserId();

        Post post = new Post();
        post.setTitle(title);
        post.setPreview(preview);
        post.setContent(content);
        post.setUserId(userId);
        post.setCreatedAt(LocalDateTime.now());
        post.setCommentCount(0);
        post.setLikeCount(0);

        String id =  UUID.randomUUID().toString();
        post.setId(id);

        try {
            postMapper.insert(post);
        } catch (Exception e) {
            throw new RuntimeException("insert organization failed: " + e.getMessage());
        }

        PostVO postVO = convertToVO(post);
        postVO.setIsLike(false);

        return postVO;
    }

    @Override
    public PostVO updatePost(String id, String title, String preview, String content) {
        String userId = BaseContext.getUserId();

        Post post = postMapper.selectById(id);

        if (post == null) {
            throw new RuntimeException("post not found, id: " + id);
        }

        if (!(post.getUserId().equals(userId))) {
            throw new RuntimeException("user id not match");
        }

        if (title != null) {
            post.setTitle(title);
        }
        if (preview != null) {
            post.setPreview(preview);
        }
        if (content != null) {
            post.setContent(content);
        }
        post.setUpdatedAt(LocalDateTime.now());

        try {
            postMapper.update(post);
        } catch (Exception e) {
            throw new RuntimeException("update post failed: " + e.getMessage());
        }

        PostVO postVO = convertToVO(post);
        postVO.setIsLike(likeService.checkLikeStatus(userId, postVO.getId()));

        return postVO;
    }

    @Override
    public Boolean deletePostById(String id) {
        String userId = BaseContext.getUserId();
        Post post = postMapper.selectById(id);

        if (post == null) {
            throw new RuntimeException("post is null");
        }
        if (!(userId.equals(post.getUserId()))) {
            throw new RuntimeException("cannot delete post of others");
        }

        int rows = 0;
        try {
            rows = postMapper.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("delete organization failed: " + e.getMessage());
        }
        return rows > 0;
    }

    @Override
    public PostVO getPostById(String id) {
        Post post = postMapper.selectById(id);
        PostVO postVO = convertToVO(post);
        postVO.setIsLike(likeService.checkLikeStatus(BaseContext.getUserId(), postVO.getId()));

        return postVO;
    }

    @Override
    public List<PostVO> getUserPost(String userId, Integer pageNum, Integer pageSize) {
        return null;
    }

    @Override
    public List<PostVO> getVisiblePost(Integer pageNum, Integer pageSize) {
        return null;
    }

    @Override
    public List<PostVO> getFollowPost(Integer pageNum, Integer pageSize) {
        return List.of();
    }

    private PostVO convertToVO(Post post) {
        PostVO postVO = new PostVO();

        BeanUtils.copyProperties(post,postVO);

        SimpleUserVO userVO = new SimpleUserVO();
        userVO.setId(BaseContext.getUserId());
        userVO.setUsername(userService.getUsernameById(BaseContext.getUserId()));

        postVO.setUserVO(userVO);

        return  postVO;
    }
}
