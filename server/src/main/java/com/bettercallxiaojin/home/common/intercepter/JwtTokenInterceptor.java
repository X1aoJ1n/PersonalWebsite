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

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class JwtTokenInterceptor implements HandlerInterceptor {

    @Value("${bettercallxiaojin.jwt.admin-secret-key}")
    private String secretKey;

    @Value("${bettercallxiaojin.jwt.admin-token-name}")
    private String tokenName;

    private static final List<String> OPTIONAL_TOKEN_PATHS = Arrays.asList(
            "/comment/list/by-post",
            "/reply/list/by-comment",
            "/post/list/byUser",
            "/post/list/all",
            "/post/list/favorite"
    );

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();
        log.debug("Interceptor preHandle for URL: {}", uri);

        String token = request.getHeader(tokenName);
        boolean optional = isOptionalPath(uri) || isUserOrPostDetail(uri);

        // 没有 token 且路径是白名单：放行
        if ((token == null || token.isEmpty()) && optional) {
            log.debug("No token provided for optional path: {}", uri);
            return true;
        }

        // 没 token 且不是白名单路径：拦截
        if (token == null || token.isEmpty()) {
            log.warn("Missing token for protected path: {}", uri);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token is missing");
            return false;
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            Claims claims = JwtUtil.parseToken(token, secretKey);
            String userId = claims.get("userId", String.class);
            if (userId == null || userId.isEmpty()) {
                userId = claims.getSubject();
            }

            if (userId != null && !userId.isEmpty()) {
                BaseContext.setUserId(userId);
                request.setAttribute("username", claims.getSubject());
                log.debug("解析到 userId: {}", userId);
            }

            return true;
        } catch (Exception e) {
            // 🚫 token 无效或过期，一律拦截（包括白名单接口）
            log.error("Invalid token for path: {} -> {}", uri, e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token invalid or expired");
            return false;
        }
    }

    private boolean isOptionalPath(String uri) {
        return OPTIONAL_TOKEN_PATHS.stream().anyMatch(uri::startsWith);
    }

    private boolean isUserOrPostDetail(String uri) {
        return (
                uri.matches("^/user/[^/]+$")
                || uri.matches("^/post/[^/]+$")
                || uri.matches("^/organization/[^/]+$")
                || uri.matches("^/contact/[^/]+$")
        );
    }
}