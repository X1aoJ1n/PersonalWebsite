package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.mapper.ContactMapper;
import com.bettercallxiaojin.home.mapper.FollowMapper;
import com.bettercallxiaojin.home.mapper.OrganizationMapper;
import com.bettercallxiaojin.home.mapper.UserMapper;
import com.bettercallxiaojin.home.pojo.VO.*;
import com.bettercallxiaojin.home.pojo.entity.User;
import com.bettercallxiaojin.home.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final OrganizationMapper organizationMapper;
    private final ContactMapper contactMapper;
    private final StringRedisTemplate redisTemplate;

    private final FollowMapper followMapper;

    private static final String CHANGE_PREFIX = "change:code:";

    @Override
    public UserVO getUserById(String id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("user is null");
        }

        List<OrganizationVO> organizations = organizationMapper.selectVOByUserId(id);
        List<ContactVO> contacts = contactMapper.selectVOByUserId(id);


        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        userVO.setContacts(contacts);
        userVO.setOrganizations(organizations);

        return userVO;
    }

    @Override
    public String getUsernameById(String id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("user is null");
        }
        return user.getUsername();
    }

    @Override
    public UserPreviewVO getUserPreviewById(String id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("user is null");
        }

        UserPreviewVO userPreviewVO = new UserPreviewVO();

        BeanUtils.copyProperties(user, userPreviewVO);

        userPreviewVO.setIsFollowed(followMapper.existsByUserIdAndFollowId(BaseContext.getUserId(),id));

        return userPreviewVO;
    }

    @Override
    public List<SimpleUserVO> getBatchUser(List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }

        return userMapper.selectSimpleUsersByIds(userIds);
    }

    @Override
    public UserVO updateUser(String username, String introduction) {
        String userId = BaseContext.getUserId();

        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("user is null");
        }


        if (username != null && !username.isEmpty()) {
            user.setUsername(username);
        }

        if (introduction != null && !introduction.isEmpty()) {
            user.setIntroduction(introduction);
        }

        userMapper.updateUserById(user);


        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }

    @Override
    public UserVO updateIcon(String iconUrl) {
        String userId = BaseContext.getUserId();
        log.info(userId);

        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("user is null");
        }

        userMapper.updateIcon(userId, iconUrl);

        user.setIcon(iconUrl);

        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }

    // @Override
    public UserVO updateBackground(String backgroundUrl) {
        String userId = BaseContext.getUserId();

        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("user is null");
        }

        userMapper.updateBackground(userId, backgroundUrl);

        user.setBackground(backgroundUrl);

        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }



    @Override
    public void changeEmail(String code, String email) {
        User user = userMapper.selectByEmail(email);
        String userId = BaseContext.getUserId();
        if (user != null) {
            throw new RuntimeException("email is bind to user:" + userId);
        }

        user = userMapper.selectById(userId);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String realCode = redisTemplate.opsForValue().get(CHANGE_PREFIX + email);
        if (realCode == null || !realCode.equals(code)) {
            throw new RuntimeException("code not match");
        }
        redisTemplate.delete(CHANGE_PREFIX + email);

        userMapper.updateEmail(userId, email);
    }

}
