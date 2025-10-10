package com.bettercallxiaojin.home.controller;


import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.pojo.DTO.LikeDTO;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
@Tag(name = "评论管理", description = "评论相关接口")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("")
    @Operation(summary = "点赞", description = "对帖子或评论进行点赞")
    public Response<Boolean> like(@RequestBody @Valid LikeDTO likeDTO) {
        try {
            return Response.success(likeService.like(likeDTO.getTargetType(), likeDTO.getTargetId()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @DeleteMapping("/cancel")
    @Operation(summary = "取消点赞", description = "取消对帖子或评论的点赞")
    public Response<Boolean> unlike(@RequestBody @Valid LikeDTO likeDTO) {
        try {
            return Response.success(likeService.unlike(likeDTO.getTargetType(), likeDTO.getTargetId()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @GetMapping("/check")
    @Operation(summary = "检查点赞状态", description = "检查当前用户是否对某帖子或评论点赞")
    public Response<Boolean> checkLiked(@RequestBody @Valid LikeDTO likeDTO) {
        try {
            return Response.success(likeService.checkLikeStatus(likeDTO.getTargetType(), likeDTO.getTargetId()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
}