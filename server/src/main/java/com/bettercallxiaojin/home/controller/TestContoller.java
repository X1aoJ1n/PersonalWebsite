package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.pojo.entity.Response;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
@Tag(name = "测试", description = "测试接口")
public class TestContoller {

    @GetMapping
    public Response<String> test() {

        return Response.success(BaseContext.getUserId());
    }
}
