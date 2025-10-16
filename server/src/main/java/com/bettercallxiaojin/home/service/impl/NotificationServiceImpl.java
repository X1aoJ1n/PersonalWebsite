package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.common.Constant.NotificationConstant;
import com.bettercallxiaojin.home.common.Constant.TargetTypeConstant;
import com.bettercallxiaojin.home.mapper.*;
import com.bettercallxiaojin.home.pojo.VO.NotificationVO;
import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.pojo.entity.Comment;
import com.bettercallxiaojin.home.pojo.entity.Notification;
import com.bettercallxiaojin.home.pojo.entity.Post;
import com.bettercallxiaojin.home.pojo.entity.Reply;
import com.bettercallxiaojin.home.service.NotificationService;
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
public class NotificationServiceImpl implements NotificationService {

    private final PostMapper postMapper;
    private final CommentMapper commentMapper;
    private final ReplyMapper replyMapper;
    private final NotificationMapper notificationMapper;
    private final UserMapper userMapper;


    @Override
    public Integer countUnread(Integer type) {
        String userId = BaseContext.getUserId();
        return notificationMapper.countUnreadByType(userId, type);
    }

    @Override
    public Integer countAllUnread() {
        String userId = BaseContext.getUserId();
        return notificationMapper.countAllUnread(userId);
    }

    @Override
    public Boolean read(String id) {
        return notificationMapper.updateRead(id) > 0;
    }

    @Override
    public Boolean readBatch(Integer type) {
        return notificationMapper.updateReadBatch(BaseContext.getUserId(), type) > 0;
    }

    @Override
    public Boolean updateLike(String targetId, Integer targetType) {

        log.info("updateLike");

        Notification notification = new Notification();
        String currentUserId = BaseContext.getUserId();

        if (targetType.equals(TargetTypeConstant.POST)) {
            Post post = postMapper.selectById(targetId);

            // 自己给自己的帖子点赞，不通知
            if (post.getUserId().equals(currentUserId)) return false;

            notification.setUserId(post.getUserId());
            notification.setTargetContent(post.getTitle());
            notification.setPostId(post.getId());
        } else if (targetType.equals(TargetTypeConstant.COMMENT)) {
            Comment comment = commentMapper.selectById(targetId);


            // 自己给自己的评论点赞，不通知
            if (comment.getUserId().equals(currentUserId)) return false;

            notification.setUserId(comment.getUserId());
            notification.setTargetContent(comment.getContent());
            notification.setPostId(comment.getPostId());
        } else if (targetType.equals(TargetTypeConstant.REPLY)) {
            Reply reply = replyMapper.selectById(targetId);
            // 自己给自己的回复点赞，不通知
            if (reply.getUserId().equals(currentUserId)) return false;

            notification.setUserId(reply.getUserId());
            notification.setTargetContent(reply.getContent());

            Comment comment = commentMapper.selectById(reply.getCommentId());

            notification.setPostId(comment.getPostId());
        } else {
            throw new RuntimeException("targetType error");
        }

        notification.setId(UUID.randomUUID().toString());
        notification.setRead(false);
        notification.setType(NotificationConstant.LIKE);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setTargetUserId(currentUserId);
        notification.setTargetId(targetId);
        notification.setTargetType(targetType);

        int rows = 0;
        try {
            rows = notificationMapper.insert(notification);
        } catch (Exception e) {
            throw new RuntimeException("like error: " + e.getMessage());
        }
        return rows > 0;
    }


    @Override
    public Boolean updateComment(String content, String targetId) {
        String currentUserId = BaseContext.getUserId();
        Post post = postMapper.selectById(targetId);

        // 自己评论自己的帖子，不通知
        if (post.getUserId().equals(currentUserId)) return false;

        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setRead(false);
        notification.setType(NotificationConstant.COMMENT);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setTargetUserId(currentUserId);
        notification.setTargetId(targetId);
        notification.setTargetType(TargetTypeConstant.POST);
        notification.setUserId(post.getUserId());
        notification.setTargetContent(post.getTitle());
        notification.setContent(content);
        notification.setPostId(post.getId());

        int rows = 0;
        try {
            rows = notificationMapper.insert(notification);
        } catch (Exception e) {
            throw new RuntimeException("comment error: " + e.getMessage());
        }
        return rows > 0;
    }


    @Override
    public Boolean updateReply(String content, String targetId, Integer targetType) {
        Notification notification = new Notification();

        notification.setId(UUID.randomUUID().toString());
        notification.setRead(false);
        notification.setType(NotificationConstant.REPLY);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setTargetUserId(BaseContext.getUserId());
        notification.setTargetId(targetId);
        notification.setTargetType(targetType);
        notification.setContent(content);

        if (targetType.equals(TargetTypeConstant.COMMENT)) {
            Comment comment = commentMapper.selectById(targetId);
            notification.setUserId(comment.getUserId());
            notification.setTargetContent(comment.getContent());
            notification.setPostId(comment.getPostId());
        } else if (targetType.equals(TargetTypeConstant.REPLY)) {
            Reply reply = replyMapper.selectById(targetId);
            notification.setUserId(reply.getUserId());
            notification.setTargetContent(reply.getContent());
            Comment comment = commentMapper.selectById(reply.getCommentId());

            notification.setPostId(comment.getPostId());
        } else {
            throw new RuntimeException("targetType error");
        }

        int rows = 0;
        try {
            rows = notificationMapper.insert(notification);
        } catch (Exception e) {
            throw new RuntimeException("like error: " + e.getMessage());
        }
        return rows > 0;
    }

    @Override
    public Boolean updateFollow(String userId) {

        Notification notification = new Notification();

        notification.setId(UUID.randomUUID().toString());
        notification.setUserId(userId);
        notification.setRead(false);
        notification.setType(NotificationConstant.FOLLOW);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setTargetUserId(BaseContext.getUserId());


        int rows = 0;
        try {
            rows = notificationMapper.insert(notification);
        } catch (Exception e) {
            throw new RuntimeException("like error: " + e.getMessage());
        }
        return rows > 0;
    }

    @Override
    public Boolean deleteLike(String targetId, Integer targetType) {
        int rows = 0;
        try {
            rows = notificationMapper.deleteLike(
                    BaseContext.getUserId(),
                    targetId,
                    targetType,
                    NotificationConstant.LIKE
            );
        } catch (Exception e) {
            throw new RuntimeException("delete like error: " + e.getMessage());
        }
        return rows > 0;
    }

    @Override
    public Boolean deleteFollow(String userId) {
        int rows = 0;
        try {
            rows = notificationMapper.deleteFollow(
                    BaseContext.getUserId(),
                    userId,
                    NotificationConstant.FOLLOW
            );
        } catch (Exception e) {
            throw new RuntimeException("delete follow error: " + e.getMessage());
        }
        return rows > 0;
    }

    @Override
    public List<NotificationVO> getLikeNotification() {
        List<Notification> notifications = notificationMapper.selectByUserAndType(
                BaseContext.getUserId(),
                NotificationConstant.LIKE
        );
        if (notifications.isEmpty()) {
            return List.of();
        }
        return convertToNotificationVOList(notifications);
    }

    @Override
    public List<NotificationVO> getFollowNotification() {
        List<Notification> notifications = notificationMapper.selectByUserAndType(
                BaseContext.getUserId(),
                NotificationConstant.FOLLOW
        );
        if (notifications.isEmpty()) {
            return List.of();
        }
        return convertToNotificationVOList(notifications);
    }

    @Override
    public List<NotificationVO> getCommentNotification() {
        List<Notification> comments = notificationMapper.selectByUserAndType(
                BaseContext.getUserId(),
                NotificationConstant.COMMENT
        );
        List<Notification> replies = notificationMapper.selectByUserAndType(
                BaseContext.getUserId(),
                NotificationConstant.REPLY
        );

        List<Notification> notifications = new ArrayList<>();
        if (comments != null) notifications.addAll(comments);
        if (replies != null) notifications.addAll(replies);

        if (notifications.isEmpty()) {
            return List.of();
        }

        notifications.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        return convertToNotificationVOList(notifications);
    }



    private List<NotificationVO> convertToNotificationVOList(List<Notification> list) {
        return list.stream().map(notification -> {
            NotificationVO vo = new NotificationVO();

            BeanUtils.copyProperties(notification, vo);

            SimpleUserVO user = userMapper.getSimpleUserVO(notification.getTargetUserId());
            vo.setTargetUser(user);

            return vo;
        }).toList();
    }
}
