package com.bettercallxiaojin.home.pojo.VO;

import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationVO {
    private String id;
    private Boolean read;
    private Integer type;
    private LocalDateTime createdAt;
    private SimpleUserVO targetUser;
    private String targetId;
    private Integer targetType;
    private String targetContent;
    private String content;
    private String postId;
}
