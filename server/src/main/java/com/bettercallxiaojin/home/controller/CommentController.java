package com.bettercallxiaojin.home.controller;


import com.bettercallxiaojin.home.pojo.DTO.AddCommentDTO;
import com.bettercallxiaojin.home.pojo.DTO.CommentDTO;
import com.bettercallxiaojin.home.pojo.VO.CommentVO;
import com.bettercallxiaojin.home.pojo.entity.PageQuery;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
@Tag(name = "评论管理", description = "评论相关接口")
public class CommentController {

    private CommentService commentService;


    @PostMapping("/create")
    @Operation(summary = "创建评论", description = "对帖子发表评论或回复其他评论")
    public Response<CommentVO> createComment(@RequestBody @Valid AddCommentDTO addCommentDTO) {

        return null;

    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除评论", description = "删除自己发表的评论")
    public Response<Boolean> deleteComment(@RequestParam String id) {

        return null;
    }


    @GetMapping("/list/by-post")
    @Operation(summary = "获取帖子评论", description = "获取指定帖子下的评论列表")
    public Response<List<CommentVO>> getCommentsByPostId(@RequestBody @Valid PageQuery pageQuery) {

        return null;
    }


    @PutMapping("/update")
    @Operation(summary = "修改评论", description = "修改用户的评论")
    public Response<CommentVO> updateComment(@RequestBody @Valid CommentDTO commentDTO) {
        return null;
    }
}