package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.pojo.DTO.ChangePasswordDTO;
import com.bettercallxiaojin.home.pojo.DTO.UserUpdateDTO;
import com.bettercallxiaojin.home.pojo.VO.UserVO;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.AuthService;
import com.bettercallxiaojin.home.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "用户管理", description = "用户相关接口")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/{id}")
    @Operation(summary = "根据id获取用户")
    public Response<UserVO> getUserById(@PathVariable String id) {
        if (id == null || id.isEmpty()) {
            return Response.error("id is empty or null");
        }
        try {
            UserVO user = userService.getUserById(id);
            return Response.success(user);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    @Operation(summary = "修改用户信息")
    public Response<UserVO> updateUserById(@Valid @RequestBody UserUpdateDTO userUpdateDTO) {

        try {
            UserVO user = userService.updateUser(userUpdateDTO.getUsername(), userUpdateDTO.getIntroduction());
            return Response.success(user);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @GetMapping("/getChangePasswordCode")
    @Operation(summary = "获取改密码验证码")
    public Response<Object> getChangePasswordCode() {
        try {
            authService.getChangePasswordCode();
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @PutMapping("/change-password")
    @Operation(summary = "用户更改密码")
    public Response<Object> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        if (!changePasswordDTO.getPassword().equals(changePasswordDTO.getConfirmPassword())) {
            return Response.error("Password and confirm password do not match");
        }

        try {
            authService.changePassword(changePasswordDTO.getCode(), changePasswordDTO.getPassword());
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
}
