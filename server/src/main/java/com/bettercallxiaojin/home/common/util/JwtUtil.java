package com.bettercallxiaojin.home.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtUtil {

    /**
     * 生成 JWT Token
     * @param userId 用户ID
     * @param secretKey 密钥
     * @param ttlMillis 有效期（毫秒）
     */
    public static String generateToken(String userId, String secretKey, long ttlMillis) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date exp = new Date(nowMillis + ttlMillis);

        return Jwts.builder()
                .setSubject(userId)
                .claim("userId", userId)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    /**
     * 解析 JWT Token
     */
    public static Claims parseToken(String token, String secretKey) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }
}
