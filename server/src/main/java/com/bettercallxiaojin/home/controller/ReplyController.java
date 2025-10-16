package com.bettercallxiaojin.home.controller;


import com.bettercallxiaojin.home.common.Constant.StatusConstant;
import com.bettercallxiaojin.home.common.Constant.TargetTypeConstant;
import com.bettercallxiaojin.home.pojo.DTO.AddReplyDTO;
import com.bettercallxiaojin.home.pojo.DTO.ReplyDTO;
import com.bettercallxiaojin.home.pojo.VO.ReplyVO;
import com.bettercallxiaojin.home.pojo.entity.PageQuery;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.NotificationService;
import com.bettercallxiaojin.home.service.ReplyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
@Tag(name = "评论回复管理", description = "回复评论的内容相关接口")
public class ReplyController {

    private final ReplyService replyService;
    private final NotificationService notificationService;

    @PostMapping("/create")
    @Operation(summary = "创建回复", description = "对帖子发表回复或回复其他评论")
    public Response<ReplyVO> createReply(@RequestBody @Valid AddReplyDTO addReplyDTO) {
        try {
            if (addReplyDTO.getReplyTo() != null) {
                notificationService.updateReply(addReplyDTO.getContent(), addReplyDTO.getReplyTo(), TargetTypeConstant.REPLY);
            } else {
                notificationService.updateReply(addReplyDTO.getContent(), addReplyDTO.getCommentId(), TargetTypeConstant.COMMENT);
            }
            return Response.success(replyService.createReply(addReplyDTO.getCommentId(), addReplyDTO.getReplyTo(), addReplyDTO.getContent()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PutMapping("/delete")
    @Operation(summary = "删除回复", description = "删除自己发表的回复")
    public Response<Boolean> deleteComment(@RequestParam String id) {
        try {
            return Response.success(replyService.changeReplyStatus(id, StatusConstant.DELETED));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PutMapping("/archive")
    @Operation(summary = "隐藏回复", description = "隐藏自己发表的回复")
    public Response<Boolean> archiveComment(@RequestParam String id) {
        try {
            return Response.success(replyService.changeReplyStatus(id, StatusConstant.ARCHIVE));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PutMapping("/unarchive")
    @Operation(summary = "删除回复", description = "删除自己发表的回复")
    public Response<Boolean> unarchiveComment(@RequestParam String id) {
        try {
            return Response.success(replyService.changeReplyStatus(id, StatusConstant.OK));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    @Operation(summary = "修改回复", description = "修改用户的回复")
    public Response<ReplyVO> updateReply(@RequestBody @Valid ReplyDTO replyDTO) {
        try {
            return Response.success(replyService.updateReply(replyDTO.getId(), replyDTO.getContent()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @GetMapping("/list/by-comment")
    @Operation(summary = "获取评论回复", description = "获取指定评论下的回复列表")
    public Response<List<ReplyVO>> getRepliesByCommentId(
            @RequestParam("id") String commentId,
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        try {
            return Response.success(replyService.getRepliesByCommentId(commentId, pageNum, pageSize));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

}