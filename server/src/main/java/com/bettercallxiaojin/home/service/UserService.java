package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.UserVO;

public interface UserService {

    UserVO getUserById(String id);

    UserVO updateUser(String username, String introduction);
}
