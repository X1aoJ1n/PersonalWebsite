package com.bettercallxiaojin.home.pojo.VO;

import java.time.LocalDateTime;

public class SimplePostVO {
    private String id;
    private SimpleUserVO userVO;
    private String title;
    private String preview;
    private String content;
    private Integer likeCount;
    private Integer commentCount;
    private LocalDateTime createdAt;
}
