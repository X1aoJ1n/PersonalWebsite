package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.common.Constant.TargetTypeConstant;
import com.bettercallxiaojin.home.mapper.FollowMapper;
import com.bettercallxiaojin.home.mapper.PostMapper;
import com.bettercallxiaojin.home.pojo.VO.PostVO;
import com.bettercallxiaojin.home.pojo.VO.SimplePostVO;
import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.pojo.VO.UserVO;
import com.bettercallxiaojin.home.pojo.entity.Post;
import com.bettercallxiaojin.home.service.FollowService;
import com.bettercallxiaojin.home.service.LikeService;
import com.bettercallxiaojin.home.service.PostService;
import com.bettercallxiaojin.home.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final UserService userService;
    private final LikeService likeService;
    private final FollowMapper followMapper;

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
            throw new RuntimeException("insert failed: " + e.getMessage());
        }

        PostVO postVO = convertToPostVO(post);

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

        PostVO postVO = convertToPostVO(post);

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
            throw new RuntimeException("delete post failed: " + e.getMessage());
        }
        return rows > 0;
    }

    @Override
    public PostVO getPostById(String id) {
        Post post = postMapper.selectById(id);
        PostVO postVO = convertToPostVO(post);

        return postVO;
    }

    @Override
    public List<SimplePostVO> getUserPost(String userId, Integer pageNum, Integer pageSize) {

        List<Post> posts = postMapper.selectByUserId(userId, pageSize, (pageNum - 1) * pageSize);
        if (posts == null || posts.isEmpty()) {
            return List.of();
        }
        List<SimplePostVO> simplePostVOs = new ArrayList<>();
        for  (Post post : posts) {
            SimplePostVO simplePostVO = convertToSimplePostVO(post);
            simplePostVOs.add(simplePostVO);
        }

        return simplePostVOs;
    }

    @Override
    public List<SimplePostVO> getVisiblePost(Integer pageNum, Integer pageSize) {
        List<Post> posts = postMapper.selectLatest( pageSize, (pageNum - 1) * pageSize);
        if (posts == null || posts.isEmpty()) {
            return List.of();
        }
        List<SimplePostVO> simplePostVOs = new ArrayList<>();
        for  (Post post : posts) {
            SimplePostVO simplePostVO = convertToSimplePostVO(post);
            simplePostVOs.add(simplePostVO);
        }

        return simplePostVOs;
    }

    @Override
    public List<SimplePostVO> getFavoritePost(Integer pageNum, Integer pageSize) {
        List<Post> posts = postMapper.selectFavorite( pageSize, (pageNum - 1) * pageSize);
        if (posts == null || posts.isEmpty()) {
            return List.of();
        }
        List<SimplePostVO> simplePostVOs = new ArrayList<>();
        for  (Post post : posts) {
            SimplePostVO simplePostVO = convertToSimplePostVO(post);
            simplePostVOs.add(simplePostVO);
        }

        return simplePostVOs;
    }

    @Override
    public List<SimplePostVO> getFollowPost(Integer pageNum, Integer pageSize) {
        List<String> userIds = followMapper.selectFollowingByUserId(BaseContext.getUserId());

        log.info(userIds.toString());
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }

        int offset = (pageNum - 1) * pageSize;
        List<Post> posts = postMapper.selectByUserIds(userIds, pageSize, offset);
        if (posts == null || posts.isEmpty()) {
            return List.of();
        }
        List<SimplePostVO> simplePostVOs = new ArrayList<>();
        for  (Post post : posts) {
            SimplePostVO simplePostVO = convertToSimplePostVO(post);
            simplePostVOs.add(simplePostVO);
        }

        return simplePostVOs;
    }

    private PostVO convertToPostVO(Post post) {
        PostVO postVO = new PostVO();

        BeanUtils.copyProperties(post,postVO);

        UserVO userVO = userService.getUserById(post.getUserId());

        SimpleUserVO simpleUserVO = new SimpleUserVO();
        simpleUserVO.setId(userVO.getId());
        simpleUserVO.setUsername(userVO.getUsername());
        simpleUserVO.setIcon(userVO.getIcon());

        postVO.setUserVO(simpleUserVO);
        postVO.setIsLike(likeService.checkLikeStatus(TargetTypeConstant.POST, postVO.getId()));

        postVO.setIsCreator(userVO.getId().equals(BaseContext.getUserId()));

        return postVO;
    }

    private SimplePostVO convertToSimplePostVO(Post post) {
        SimplePostVO simplePostVO = new SimplePostVO();

        BeanUtils.copyProperties(post,simplePostVO);

        UserVO userVO = userService.getUserById(post.getUserId());

        SimpleUserVO simpleUserVO = new SimpleUserVO();
        simpleUserVO.setId(userVO.getId());
        simpleUserVO.setUsername(userVO.getUsername());
        simpleUserVO.setIcon(userVO.getIcon());
        simplePostVO.setUserVO(simpleUserVO);

        return simplePostVO;
    }
}
