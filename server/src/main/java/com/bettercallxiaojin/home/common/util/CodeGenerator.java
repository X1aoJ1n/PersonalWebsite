package com.bettercallxiaojin.home.common.util;

import java.util.Random;

public class CodeGenerator {
    public static String generateCode(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10)); // 0-9 随机数
        }
        return sb.toString();
    }
}