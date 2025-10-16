package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.NotificationVO;

import java.util.List;

public interface NotificationService {

    Integer countUnread(Integer type);

    Boolean read(String id);

    Boolean readBatch(Integer type);

    Boolean updateLike(String targetId, Integer targetType);

    Boolean updateComment(String Conetent, String targetId);

    Boolean updateReply(String Conetent, String targetId, Integer targetType);

    Boolean updateFollow(String userId);

    Boolean deleteLike(String targetId, Integer targetType);

    Boolean deleteFollow(String userId);

    List<NotificationVO> getLikeNotification();

    List<NotificationVO> getFollowNotification();

    List<NotificationVO> getCommentNotification();

    Integer countUnread(int type);

    Integer countAllUnread();
}
