package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.pojo.VO.SimplePostVO;
import com.bettercallxiaojin.home.pojo.VO.UserPreviewVO;
import com.bettercallxiaojin.home.pojo.entity.PageQuery;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.RecentViewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/recent-view")
@RequiredArgsConstructor
@Tag(name = "最近浏览管理", description = "最近浏览相关接口")
public class RecentViewController {

    private final RecentViewService recentViewService;

    @GetMapping("/post")
    @Operation(summary = "获取用户最近浏览的帖子列表", description = "获取用户最近浏览的帖子列表，支持分页")
    public Response<List<SimplePostVO>> getRecentViewPost(PageQuery pageQuery) {
        try {
            return Response.success(recentViewService.getRecentViewPost(pageQuery.getPageNum(),pageQuery.getPageSize()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/user")
    @Operation(summary = "获取用户发布的帖子列表", description = "获取指定用户发布的帖子列表，支持分页")
    public Response<List<UserPreviewVO>> getRecentViewUser(PageQuery pageQuery) {
        try {
            return Response.success(recentViewService.getRecentViewUser(pageQuery.getPageNum(),pageQuery.getPageSize()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
}
