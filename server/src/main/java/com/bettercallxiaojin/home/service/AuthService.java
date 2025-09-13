package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.UserLoginVO;
import org.springframework.stereotype.Service;


@Service
public interface AuthService {
    UserLoginVO loginByPassword(String email, String password);

    UserLoginVO loginByCode(String email, String code);

    void getRegisterCode(String email);

    UserLoginVO register(String code, String email, String password, String username);

    void getChangePasswordCode();

    void changePassword(String code, String password);
}
