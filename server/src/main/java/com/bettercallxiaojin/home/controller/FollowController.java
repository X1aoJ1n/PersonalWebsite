package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.pojo.VO.UserVO;
import com.bettercallxiaojin.home.pojo.entity.PageQuery;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.FollowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/follow")
@RequiredArgsConstructor
@Tag(name = "关注管理", description = "关注以及粉丝相关接口")
public class FollowController {
    private final FollowService followService;

    @PostMapping("")
    @Operation(summary = "关注", description = "关注用户")
    public Response<Object> follow(@RequestParam String followId) {
        if (followId == null || followId.isEmpty()) {
            return Response.error("id is empty or null");
        }
        try {
            followService.follow(followId);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @DeleteMapping("/cancel")
    @Operation(summary = "取消关注", description = "取消关注用户")
    public Response<UserVO> unfollow(@RequestParam String followId) {
        if (followId == null || followId.isEmpty()) {
            return Response.error("id is empty or null");
        }
        try {
            followService.unfollow(followId);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/check")
    @Operation(summary = "检查关注状态", description = "检查当前用户是否关注目标用户")
    public Response<Boolean> checkFollowStatus(@RequestParam String followId) {
        if (followId == null || followId.isEmpty()) {
            return Response.error("id is empty or null");
        }
        try {
            Boolean exists = followService.checkFollowStatus(followId);
            return Response.success(exists);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/list-following")
    @Operation(summary = "获取关注列表", description = "获取当前用户的关注列表")
    public Response<List<SimpleUserVO>> getFollowingList( PageQuery pageQuery) {
        try {
            List<SimpleUserVO> simpleUserVOS = followService.getFollowingList(pageQuery.getPageNum(), pageQuery.getPageSize());
            return Response.success(simpleUserVOS);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/list-follower")
    @Operation(summary = "获取粉丝列表", description = "获取当前用户的粉丝列表")
    public Response<List<SimpleUserVO>> getFollowerList(@RequestBody @Valid PageQuery pageQuery) {
        try {
            List<SimpleUserVO> simpleUserVOS = followService.getFollowerList(pageQuery.getPageNum(), pageQuery.getPageSize());
            return Response.success(simpleUserVOS);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

}
