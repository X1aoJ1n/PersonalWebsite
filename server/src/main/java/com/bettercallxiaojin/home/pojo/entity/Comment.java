package com.bettercallxiaojin.home.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    private String id;
    private String userId;
    private String postId;
    private String content;
    private Integer status;
    private Integer likeCount;
    private Integer replyCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
