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
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token is missing");
            return false;
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token must start with 'Bearer '");
            return false;
        }

        if (TEST_ADMIN_TOKEN.equals(token)) {
            request.setAttribute("username", "admin");
            BaseContext.setUserId("1"); // admin 用户 ID
            return true;
        }

        try {
            Claims claims = JwtUtil.parseToken(token, secretKey);
            request.setAttribute("username", claims.getSubject());
            String userId = claims.get("userId", String.class);
            BaseContext.setUserId(userId);
            return true;
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token invalid or expired");
            return false;
        }
    }
}
