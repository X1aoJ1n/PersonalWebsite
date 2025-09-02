package com.bettercallxiaojin.home.common;

public class BaseContext {
    private static final ThreadLocal<String> userIdThreadLocal = new ThreadLocal<>();

    public static void setUserId(String userId) {
        userIdThreadLocal.set(userId);
    }

    public static String getUserId() {
        return userIdThreadLocal.get();
    }

    public static void remove() {
        userIdThreadLocal.remove();
    }
}