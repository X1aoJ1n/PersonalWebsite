package com.bettercallxiaojin.home.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String id;
    private String username;
    private String password;
    private String email;
    private String icon;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String introduction;
    private Integer followerCount;
    private Integer followingCount;
}