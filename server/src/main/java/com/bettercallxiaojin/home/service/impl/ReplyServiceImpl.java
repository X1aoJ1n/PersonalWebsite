package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.common.Constant.StatusConstant;
import com.bettercallxiaojin.home.common.Constant.TargetTypeConstant;
import com.bettercallxiaojin.home.mapper.*;
import com.bettercallxiaojin.home.pojo.VO.*;
import com.bettercallxiaojin.home.pojo.entity.Comment;
import com.bettercallxiaojin.home.pojo.entity.Post;
import com.bettercallxiaojin.home.pojo.entity.Reply;
import com.bettercallxiaojin.home.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReplyServiceImpl implements ReplyService {

    private final UserService userService;
    private final LikeService likeService;

    private final CommentMapper commentMapper;
    private final PostMapper postMapper;
    private final ReplyMapper replyMapper;
    private final FollowMapper followMapper;
    private final UserMapper userMapper;


    @Override
    public ReplyVO createReply(String commentId, String replyTo, String content) {

        Comment comment = commentMapper.selectById(commentId);

        if (comment == null) {
            throw new RuntimeException("comment not found");
        }

        Post post = postMapper.selectById(comment.getPostId());
        if (post == null) {
            throw new RuntimeException("Post Not Found");
        }

        String userId = BaseContext.getUserId();

        Reply reply = new Reply();

        reply.setUserId(userId);
        reply.setCommentId(commentId);
        reply.setContent(content);
        reply.setLikeCount(0);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setStatus(StatusConstant.OK);
        reply.setReplyTo(replyTo);

        String id =  UUID.randomUUID().toString();
        reply.setId(id);


        try {
            commentMapper.updateReplyCount(commentId, 1);
            replyMapper.insert(reply);
        } catch (Exception e) {
            throw new RuntimeException("insert failed: " + e.getMessage());
        }

        ReplyVO replyVO = convertToReplyVO(reply);

        return replyVO;
    }

    @Override
    public Boolean changeReplyStatus(String id, Integer status) {
        String userId = BaseContext.getUserId();
        Reply reply = replyMapper.selectById(id);

        if (reply == null) {
            throw new RuntimeException("reply is null");
        }
        if (!(userId.equals(reply.getUserId()))) {
            throw new RuntimeException("cannot change status of others");
        }

        int rows = 0;
        try {
            rows = replyMapper.updateStatus(id, status);
        } catch (Exception e) {
            throw new RuntimeException("change status failed: " + e.getMessage());
        }
        return rows > 0;
    }


    @Override
    public ReplyVO updateReply(String id, String content) {
        String userId = BaseContext.getUserId();

        Reply reply = replyMapper.selectById(id);

        if (reply == null) {
            throw new RuntimeException("reply not found, id: " + id);
        }

        if (!(reply.getUserId().equals(userId))) {
            throw new RuntimeException("user id not match");
        }

        reply.setContent(content);

        reply.setUpdatedAt(LocalDateTime.now());

        try {
            replyMapper.update(reply.getContent(), reply.getUpdatedAt(), reply.getId());
        } catch (Exception e) {
            throw new RuntimeException("update failed: " + e.getMessage());
        }

        ReplyVO replyVO = convertToReplyVO(reply);

        return replyVO;
    }

    @Override
    public List<ReplyVO> getRepliesByCommentId(String id, Integer pageNum, Integer pageSize) {
        Comment comment = commentMapper.selectById(id);
        if (comment == null) {
            throw new RuntimeException("Comment Not Found");
        }

        List<Reply> replies = replyMapper.selectByCommentId(id, pageSize, (pageNum - 1) * pageSize);

        if (replies == null || replies.isEmpty()) {
            return List.of();
        }
        List<ReplyVO> replyVOS = new ArrayList<>();
        for  (Reply reply : replies) {
            ReplyVO replyVO = convertToReplyVO(reply);
            replyVOS.add(replyVO);
        }

        return replyVOS;
    }

    @Override
    public List<ReplyVO> getOverviewReplies(String commentId) {
        return getRepliesByCommentId(commentId, 1, 5);
    }

    private ReplyVO convertToReplyVO(Reply reply) {
        ReplyVO replyVO = new ReplyVO();

        BeanUtils.copyProperties(reply, replyVO);

        UserVO userVO = userService.getUserById(reply.getUserId());

        SimpleUserVO simpleUserVO = new SimpleUserVO();
        simpleUserVO.setId(userVO.getId());
        simpleUserVO.setUsername(userVO.getUsername());
        simpleUserVO.setIcon(userVO.getIcon());

        replyVO.setUserVO(simpleUserVO);
        replyVO.setIsLike(likeService.checkLikeStatus(TargetTypeConstant.REPLY, replyVO.getId()));
        replyVO.setIsCreator(userVO.getId().equals(BaseContext.getUserId()));


        ReplyToVO replyToVO = new ReplyToVO();

        replyToVO.setReplyId(reply.getReplyTo());
        String replyToUserId = replyMapper.selectUserById(reply.getReplyTo());
        replyToVO.setUserId(replyToUserId);
        replyToVO.setUserName(userMapper.selectNameById(replyToUserId));

        replyVO.setReplyToVO(replyToVO);

        return replyVO;
    }
}
