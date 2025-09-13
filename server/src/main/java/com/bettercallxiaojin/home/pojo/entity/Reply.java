package com.bettercallxiaojin.home.pojo.entity;

import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
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
    private SimpleUserVO targetUser;
    private String content;
    private Integer likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
