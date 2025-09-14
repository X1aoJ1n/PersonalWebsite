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
    private List<Reply> replies;
    private Integer likeCount;
    private Boolean isLike;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
