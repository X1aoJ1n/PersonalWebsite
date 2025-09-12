package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.UserVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public interface UserService {

    UserVO getUserById(String id);

    UserVO updateUser(String username, String introduction);

    void changeEmail(String code, String email);

    UserVO updateIcon(@Valid String iconUrl);
}
