package com.bettercallxiaojin.home.common.intercepter;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.common.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Slf4j
public class JwtTokenInterceptor implements HandlerInterceptor {

    @Value("${bettercallxiaojin.jwt.admin-secret-key}")
    private String secretKey;

    @Value("${bettercallxiaojin.jwt.admin-token-name}")
    private String tokenName;

    private static final String TEST_ADMIN_TOKEN = "test-admin-token-123";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.info("Interceptor preHandle called for URL: {}", request.getRequestURI());

        String token = request.getHeader(tokenName);

        if (token == null || token.isEmpty()) {
            log.warn("Token is missing in header: {}", tokenName);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token is missing");
            return false;
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        } else {
            log.warn("Token format error: {}", token);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token must start with 'Bearer '");
            return false;
        }

        // 特殊测试 token，直接放行
        if (TEST_ADMIN_TOKEN.equals(token)) {
            log.info("Using TEST_ADMIN_TOKEN for admin access");
            request.setAttribute("username", "admin");
            BaseContext.setUserId("1"); // admin 用户 ID
            return true;
        }

        try {
            Claims claims = JwtUtil.parseToken(token, secretKey);

            // 优先取 userId，没有就用 subject
            String userId = claims.get("userId", String.class);
            if (userId == null || userId.isEmpty()) {
                userId = claims.getSubject();
                log.info("Token没有 userId，使用 subject 作为用户ID: {}", userId);
            } else {
                log.info("从 token 中解析到 userId: {}", userId);
            }

            if (userId == null || userId.isEmpty()) {
                log.error("Token 解析失败，未能获取 userId");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token invalid: no userId found");
                return false;
            }

            // 保存上下文
            request.setAttribute("username", claims.getSubject());
            BaseContext.setUserId(userId);

            return true;
        } catch (Exception e) {
            log.error("Token parsing error: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token invalid or expired");
            return false;
        }
    }
}
