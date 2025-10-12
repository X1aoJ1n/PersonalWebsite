package com.bettercallxiaojin.home.pojo.VO;

import com.bettercallxiaojin.home.pojo.entity.Reply;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentVO {
    private String id;
    private SimpleUserVO userVO;
    private String postId;
    private String content;
    private Integer likeCount;
    private Integer replyCount;
    private Boolean isLike;
    private Boolean isCreator;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
