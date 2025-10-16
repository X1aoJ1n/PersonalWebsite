package com.bettercallxiaojin.home.pojo.entity;

import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private String id;
    private String userId;
    private Boolean read;
    private Integer type;
    private LocalDateTime createdAt;
    private String targetUserId;
    private String targetId;
    private Integer targetType;
    private String targetContent;
    private String content;
    private String postId;
}
