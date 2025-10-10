package com.bettercallxiaojin.home.service;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public interface LikeService {
    Boolean checkLikeStatus(Integer targetType, String targetId);

    Boolean like(Integer targetType, String targetId);

    Boolean unlike(Integer targetType, String targetId);
}
