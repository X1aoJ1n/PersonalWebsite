package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.common.Constant.NotificationConstant;
import com.bettercallxiaojin.home.pojo.VO.NotificationVO;
import com.bettercallxiaojin.home.pojo.VO.SimplePostVO;
import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.pojo.entity.Notification;
import com.bettercallxiaojin.home.pojo.entity.PageQuery;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.NotificationService;
import com.bettercallxiaojin.home.service.RecentViewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
@Tag(name = "通知管理", description = "通知相关接口")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/count-all-unread")
    @Operation(summary = "获得未读消息的数字", description = "获得未读消息的数字")
    public Response<Integer> countAllUnread() {
        try {
            return Response.success(notificationService.countAllUnread());
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/count-like-unread")
    @Operation(summary = "获得未读点赞的数字", description = "获得未读点赞的数字")
    public Response<Integer> countLikeUnread() {
        try {
            return Response.success(notificationService.countUnread(NotificationConstant.LIKE));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/count-follow-unread")
    @Operation(summary = "获得未读关注的数字", description = "获得未读关注的数字")
    public Response<Integer> countFollowUnread() {
        try {
            return Response.success(notificationService.countUnread(NotificationConstant.FOLLOW));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/count-follow-unread")
    @Operation(summary = "获得未读评论回复的数字", description = "获得未读评论回复的数字")
    public Response<Integer> countCommentUnread() {
        try {
            return Response.success(
                    notificationService.countUnread(NotificationConstant.COMMENT) + notificationService.countUnread(NotificationConstant.REPLY)
            );
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PostMapping("/read")
    @Operation(summary = "设为已读", description = "把某个通知设为已读")
    public Response<Boolean> read(String id) {
        try {
            return Response.success(notificationService.read(id));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PostMapping("/read-batch")
    @Operation(summary = "全部设为已读", description = "把特定Type的通知全部设为已读")
    public Response<Boolean> readBatch(Integer type) {
        try {
            return Response.success(notificationService.readBatch(type));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/list-like")
    @Operation(summary = "获取点赞通知", description = "获取所有点赞通知")
    public Response<List<NotificationVO>> getLikeNotification() {
        try {
            return Response.success(notificationService.getLikeNotification());
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/list-follow")
    @Operation(summary = "获取关注通知", description = "获取所有关注通知")
    public Response<List<NotificationVO>> getFollowNotification() {
        try {
            return Response.success(notificationService.getFollowNotification());
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/list-commentAndReply")
    @Operation(summary = "获取评论通知", description = "获取所有评论和回复通知")
    public Response<List<NotificationVO>> getCommentNotification() {
        try {
            return Response.success(notificationService.getCommentNotification());
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
}
