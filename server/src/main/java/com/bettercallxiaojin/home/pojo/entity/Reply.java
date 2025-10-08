package com.bettercallxiaojin.home.pojo.entity;

import com.bettercallxiaojin.home.pojo.VO.ReplyToVO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reply {
    private String id;
    private String userId;
    private String commentId;
    private String replyTo;
    private String content;
    private Integer likeCount;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
