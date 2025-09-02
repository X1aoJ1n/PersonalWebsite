package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.util.CodeGenerator;
import com.bettercallxiaojin.home.mapper.ContactMapper;
import com.bettercallxiaojin.home.mapper.OrganizationMapper;
import com.bettercallxiaojin.home.mapper.UploadedFileMapper;
import com.bettercallxiaojin.home.pojo.VO.UserLoginVO;
import com.bettercallxiaojin.home.common.util.JwtUtil;
import com.bettercallxiaojin.home.common.util.PasswordEncodeUtil;
import com.bettercallxiaojin.home.pojo.entity.Contact;
import com.bettercallxiaojin.home.pojo.entity.Organization;
import com.bettercallxiaojin.home.pojo.entity.UploadedFile;
import com.bettercallxiaojin.home.pojo.entity.User;
import com.bettercallxiaojin.home.mapper.UserMapper;
import com.bettercallxiaojin.home.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Value("${bettercallxiaojin.jwt.admin-secret-key}")
    private String secretKey;

    @Value("${bettercallxiaojin.jwt.admin-ttl}")
    private long ttl;

    private final UserMapper userMapper;
    private final ContactMapper contactMapper;
    private final OrganizationMapper organizationMapper;
    private final JavaMailSender mailSender;
    private final StringRedisTemplate redisTemplate;
    private final UploadedFileMapper uploadedFileMapper;

    private static final String CODE_PREFIX = "email:code:";
    private static final String LOCK_PREFIX = "email:lock:";

    public UserLoginVO loginByPassword(String email, String password) {

        User user = userMapper.selectByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }


        if (!PasswordEncodeUtil.matches(password, user.getPassword())) {
            throw new RuntimeException("Password incorrect");
        }

        List<Contact> contacts = contactMapper.selectByUserId(user.getId());
        List<Organization> organizations = organizationMapper.selectByUserId(user.getId());

        user.setContacts(contacts);
        user.setOrganizations(organizations);

        UserLoginVO userLoginVO = new UserLoginVO();

        BeanUtils.copyProperties(user, userLoginVO);

        String token = JwtUtil.generateToken(user.getId(), secretKey, ttl);

        userLoginVO.setToken(token);

        return userLoginVO;
    }

    public UserLoginVO loginByCode(String email, String code) {
        User user = userMapper.selectByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String realCode = redisTemplate.opsForValue().get(CODE_PREFIX + email);
        if (realCode == null || !realCode.equals(code)) {
            throw new RuntimeException("code not match");
        }
        redisTemplate.delete(CODE_PREFIX + email);

        List<Contact> contacts = contactMapper.selectByUserId(user.getId());
        List<Organization> organizations = organizationMapper.selectByUserId(user.getId());

        user.setContacts(contacts);
        user.setOrganizations(organizations);

        UserLoginVO userLoginVO = new UserLoginVO();

        BeanUtils.copyProperties(user, userLoginVO);

        String token = JwtUtil.generateToken(user.getId(), secretKey, ttl);

        userLoginVO.setToken(token);

        return userLoginVO;
    }


    public void getRegisterCode(String email) {
        String lockKey = LOCK_PREFIX + email;
        if (redisTemplate.hasKey(lockKey)) {
            throw new RuntimeException("请求过于频繁，请稍后再试");
        }

        String code = CodeGenerator.generateCode(6);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("bihuijin427@gmail.com");
        message.setTo(email);
        message.setSubject("BetterCallXiaoJin邮箱验证码: " + code);
        message.setText("感谢您注册本网站，您本次的验证码是: " + code + "，有效期5分钟，请尽快使用。");
        mailSender.send(message);

        redisTemplate.opsForValue().set(CODE_PREFIX + email, code, 5, TimeUnit.MINUTES);

        redisTemplate.opsForValue().set(lockKey, "1", 1, TimeUnit.MINUTES);
    }

    @Override
    public UserLoginVO register(String code, String email, String password, String username) {
        // verify email and code
        if (userMapper.selectByEmail(email) != null) {
            throw new RuntimeException("email already exist");
        }

        String realCode = redisTemplate.opsForValue().get(CODE_PREFIX + email);
        if (realCode == null || !realCode.equals(code)) {
            throw new RuntimeException("code not match");
        }
        redisTemplate.delete(CODE_PREFIX + email);

        // create new user
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setEmail(email);
        user.setPassword(PasswordEncodeUtil.encode(password));  // 在这里加密密码
        user.setUsername(username);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        userMapper.insert(user);

        redisTemplate.delete(CODE_PREFIX + email);

        UserLoginVO userLoginVO = new UserLoginVO();
        BeanUtils.copyProperties(user, userLoginVO);

        log.info("userLoginVO:{}", userLoginVO);
        String token = JwtUtil.generateToken(user.getId(), secretKey, ttl);
        log.info("token:{}", token);

        userLoginVO.setToken(token);

        return userLoginVO;
    }
}
