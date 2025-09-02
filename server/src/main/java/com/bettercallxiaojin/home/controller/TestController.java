package com.bettercallxiaojin.home.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final StringRedisTemplate redisTemplate;

    @GetMapping("/test/redis")
    public String testRedis() {
        try {
            redisTemplate.opsForValue().set("test:key", "hello-redis");

            String value = redisTemplate.opsForValue().get("test:key");

            return "Redis 连接成功，取到的值：" + value;
        } catch (Exception e) {
            e.printStackTrace();
            return "Redis 连接失败：" + e.getMessage();
        }
    }
}
