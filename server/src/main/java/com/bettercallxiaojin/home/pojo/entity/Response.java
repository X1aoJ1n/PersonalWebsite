package com.bettercallxiaojin.home.pojo.entity;

import lombok.Data;

@Data
public class Response<T> {

    private int code;
    private String message;
    private T data;

    // 构造方法
    public Response(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    // 静态方法方便返回
    public static <T> Response<T> success(T data) {
        return new Response<>(200, "OK", data);
    }

    public static <T> Response<T> success() {
        return new Response<>(200, "OK", null);
    }

    public static <T> Response<T> error(String message) {
        return new Response<>(500, message, null);
    }

    public static <T> Response<T> error(String message, int code) {
        return new Response<>(code, message, null);
    }
}