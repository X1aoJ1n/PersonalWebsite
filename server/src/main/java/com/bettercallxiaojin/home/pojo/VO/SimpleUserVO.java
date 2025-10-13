package com.bettercallxiaojin.home.pojo.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimpleUserVO {
    private String id;
    private String username;
    private String icon;
    private Boolean isFollowed;
    private Boolean beingFollowed;
}