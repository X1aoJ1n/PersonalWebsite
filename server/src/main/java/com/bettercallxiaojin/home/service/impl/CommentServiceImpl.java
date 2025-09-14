package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.mapper.CommentMapper;
import com.bettercallxiaojin.home.mapper.FollowMapper;
import com.bettercallxiaojin.home.pojo.VO.*;
import com.bettercallxiaojin.home.pojo.entity.Comment;
import com.bettercallxiaojin.home.pojo.entity.Post;
import com.bettercallxiaojin.home.service.CommentService;
import com.bettercallxiaojin.home.service.LikeService;
import com.bettercallxiaojin.home.service.PostService;
import com.bettercallxiaojin.home.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final UserService userService;
    private final FollowMapper followMapper;
    private final LikeService likeService;

    @Override
    public CommentVO createComment(String postId, String content) {
        String userId = BaseContext.getUserId();

        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setPostId(postId);
        comment.setContent(content);
        comment.setLikeCount(0);
        comment.setReplyCount(0);
        comment.setCreatedAt(LocalDateTime.now());

        String id =  UUID.randomUUID().toString();
        comment.setId(id);

        try {
            commentMapper.insert(comment);
        } catch (Exception e) {
            throw new RuntimeException("insert failed: " + e.getMessage());
        }

        CommentVO commentVO = convertToCommentVO(comment);

        return commentVO;
    }



    @Override
    public Boolean deleteComment(String id) {
        String userId = BaseContext.getUserId();
        Comment comment = commentMapper.selectById(id);

        if (comment == null) {
            throw new RuntimeException("comment is null");
        }
        if (!(userId.equals(comment.getUserId()))) {
            throw new RuntimeException("cannot delete comment of others");
        }

        int rows = 0;
        try {
            rows = commentMapper.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("delete comment failed: " + e.getMessage());
        }
        return rows > 0;
    }

    @Override
    public List<CommentVO> getCommentsByPostId(String id, Integer pageNum, Integer pageSize) {

        List<Comment> comments = commentMapper.selectByPostId(id, pageSize, (pageNum - 1) * pageSize);

        List<CommentVO> commentVOS = new ArrayList<>();
        for  (Comment comment : comments) {
            CommentVO commentVO = convertToCommentVO(comment);
            commentVOS.add(commentVO);
        }

        return commentVOS;
    }

    @Override
    public CommentVO updateComment(String id, String content) {
        String userId = BaseContext.getUserId();

        Comment comment = commentMapper.selectById(id);

        if (comment == null) {
            throw new RuntimeException("comment not found, id: " + id);
        }

        if (!(comment.getUserId().equals(userId))) {
            throw new RuntimeException("user id not match");
        }

        comment.setContent(content);

        comment.setUpdatedAt(LocalDateTime.now());

        try {
            commentMapper.update(comment);
        } catch (Exception e) {
            throw new RuntimeException("update post failed: " + e.getMessage());
        }

        CommentVO commentVO = convertToCommentVO(comment);

        return commentVO;
    }

    private CommentVO convertToCommentVO(Comment comment) {
        CommentVO commentVO = new CommentVO();

        BeanUtils.copyProperties(comment, commentVO);

        UserVO userVO = userService.getUserById(comment.getUserId());

        SimpleUserVO simpleUserVO = new SimpleUserVO();
        simpleUserVO.setId(BaseContext.getUserId());
        simpleUserVO.setUsername(userVO.getUsername());
        simpleUserVO.setIcon(userVO.getIcon());
        simpleUserVO.setBeingFollow(followMapper.existsByUserIdAndFollowId(simpleUserVO.getId(), BaseContext.getUserId()));
        simpleUserVO.setIsFollow(followMapper.existsByUserIdAndFollowId(BaseContext.getUserId(), simpleUserVO.getId()));
        commentVO.setUserVO(simpleUserVO);
        commentVO.setIsLike(likeService.checkLikeStatus(BaseContext.getUserId(), commentVO.getId()));

        return commentVO;
    }
}
