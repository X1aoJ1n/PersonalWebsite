package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.UserVO;
import com.bettercallxiaojin.home.pojo.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public interface UserService {

    UserVO getUserById(String id);

    UserVO updateUser(String username, String introduction);
}
