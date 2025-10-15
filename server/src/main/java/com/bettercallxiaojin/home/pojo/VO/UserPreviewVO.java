package com.bettercallxiaojin.home.pojo.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPreviewVO {
    private String id;
    private String username;
    private String icon;
    private String introduction;
    private String background;
    private Integer followerCount;
    private Integer followingCount;
    private Boolean isFollowed;
    private Integer likeCount;
}
