package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.UserPreviewVO;
import com.bettercallxiaojin.home.pojo.VO.UserVO;
import jakarta.validation.Valid;

public interface UserService {

    UserVO getUserById(String id);

    UserVO updateUser(String username, String introduction);

    void changeEmail(String code, String email);

    UserVO updateIcon(@Valid String iconUrl);

    String getUsernameById(String id);

    UserPreviewVO getUserPreviewById(String id);
}
