package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.common.util.PasswordEncodeUtil;
import com.bettercallxiaojin.home.pojo.DTO.ChangePasswordDTO;
import com.bettercallxiaojin.home.pojo.DTO.LoginPasswordDTO;
import com.bettercallxiaojin.home.pojo.DTO.RegisterDTO;
import com.bettercallxiaojin.home.pojo.VO.UserLoginVO;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "鉴权管理", description = "注册登录相关接口")
public class AuthController {

    @Value("${bettercallxiaojin.jwt.admin-secret-key}")
    private String secretKey;

    @Value("${bettercallxiaojin.jwt.admin-ttl}")
    private long ttl;

    @Value("${bettercallxiaojin.jwt.admin-token-name}")
    private String tokenName;

    private final AuthService authService;

    @PostMapping("/login/password")
    @Operation(summary = "使用密码登录")
    public Response<UserLoginVO> loginByPassword(@Valid @RequestBody LoginPasswordDTO loginPasswordDTO) {
        try {
            UserLoginVO userLoginVO = authService.loginByPassword(loginPasswordDTO.getEmail(), loginPasswordDTO.getPassword());
            return Response.success(userLoginVO);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PostMapping("/login/code")
    @Operation(summary = "使用验证码登录")
    public Response<UserLoginVO> loginByCode(@Valid @RequestBody LoginPasswordDTO loginPasswordDTO) {
        try {
            UserLoginVO userLoginVO = authService.loginByCode(loginPasswordDTO.getEmail(), loginPasswordDTO.getPassword());
            return Response.success(userLoginVO);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/getCode")
    @Operation(summary = "获取邮箱验证码")
    public Response getRegisterCode(@Email @RequestParam String email) {
        try {
            authService.getRegisterCode(email);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PostMapping("/register")
    @Operation(summary = "使用邮箱注册")
    public Response<UserLoginVO> register(@Valid @RequestBody RegisterDTO registerDTO) {

        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            return Response.error("Password and confirm password do not match");
        }

        try {
            UserLoginVO userLoginVO = authService.register(
                    registerDTO.getCode(),
                    registerDTO.getEmail(),
                    registerDTO.getPassword(),
                    registerDTO.getUsername());
            return Response.success(userLoginVO);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
}