package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.pojo.DTO.AddPostDTO;
import com.bettercallxiaojin.home.pojo.DTO.PostDTO;
import com.bettercallxiaojin.home.pojo.VO.PostVO;
import com.bettercallxiaojin.home.pojo.VO.SimplePostVO;
import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.pojo.entity.PageQuery;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
@Tag(name = "帖子管理", description = "帖子相关接口")
public class PostController {

    private final PostService postService;


    @PostMapping("/create")
    @Operation(summary = "创建帖子", description = "创建新帖子，需要提供标题、内容和可见性设置")
    public Response<PostVO> createPost(@RequestBody @Valid AddPostDTO addPostDTO) {
        if (addPostDTO.getPreview() == null || addPostDTO.getPreview().equals("")) {
            String content = addPostDTO.getContent();
            int length = Math.min(content.length(), 100);
            addPostDTO.setPreview(content.substring(0, length));
        }
        try {
            return Response.success(postService.createPost(addPostDTO.getTitle(), addPostDTO.getPreview(), addPostDTO.getContent()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @PutMapping("/update")
    @Operation(summary = "修改帖子", description = "修改已有帖子，需要提供帖子ID和更新内容")
    public Response<PostVO> updatePost(@RequestBody @Valid PostDTO postDTO) {
        try {
            return Response.success(postService.updatePost(postDTO.getId(), postDTO.getTitle(), postDTO.getPreview(), postDTO.getContent()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除帖子", description = "逻辑删除帖子，需要提供帖子ID")
    public Response<Boolean> deletePost(@RequestParam String id) {
        try {
            return Response.success(postService.deletePostById(id));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取帖子详情", description = "根据帖子ID获取帖子详细信息")
    public Response<PostVO> getPostDetail(@PathVariable String id) {
        try {
            return Response.success(postService.getPostById(id));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @GetMapping("/list/byUser")
    @Operation(summary = "获取用户发布的帖子列表", description = "获取指定用户发布的帖子列表，支持分页")
    public Response<List<SimplePostVO>> getUserPost(PageQuery pageQuery) {
        if  (pageQuery.getId() == null) {
            return Response.error("id cannot be empty");
        }
        try {
            return Response.success(postService.getUserPost(pageQuery.getId(), pageQuery.getPageNum(),pageQuery.getPageSize()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/list/all")
    @Operation(summary = "获取所有帖子", description = "获取当前用户可见的所有帖子列表")
    public Response<List<SimplePostVO>> getVisiblePost(PageQuery pageQuery) {
        try {
            return Response.success(postService.getVisiblePost(pageQuery.getPageNum(),pageQuery.getPageSize()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/list/favorite")
    @Operation(summary = "获取点赞最多帖子", description = "获取当前用户可见的点赞最多帖子列表")
    public Response<List<SimplePostVO>> getFavoritePost(PageQuery pageQuery) {
        try {
            return Response.success(postService.getFavoritePost(pageQuery.getPageNum(),pageQuery.getPageSize()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @PostMapping("/list/follow")
    @Operation(summary = "获取关注帖子", description = "获取收藏用户的公开帖子列表")
    public Response<List<SimplePostVO>> getFollowPost(PageQuery pageQuery) {
        try {
            return Response.success(postService.getFollowPost(pageQuery.getPageNum(),pageQuery.getPageSize()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
}
