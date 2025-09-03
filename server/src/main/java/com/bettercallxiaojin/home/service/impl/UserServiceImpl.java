package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.mapper.ContactMapper;
import com.bettercallxiaojin.home.mapper.OrganizationMapper;
import com.bettercallxiaojin.home.mapper.UserMapper;
import com.bettercallxiaojin.home.pojo.VO.UserVO;
import com.bettercallxiaojin.home.pojo.entity.Contact;
import com.bettercallxiaojin.home.pojo.entity.Organization;
import com.bettercallxiaojin.home.pojo.entity.User;
import com.bettercallxiaojin.home.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final OrganizationMapper organizationMapper;
    private final ContactMapper contactMapper;

    @Override
    public UserVO getUserById(String id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("user is null");
        }

        List<Organization> organizations = organizationMapper.selectByUserId(id);
        List<Contact> contacts = contactMapper.selectByUserId(id);
        user.setOrganizations(organizations);
        user.setContacts(contacts);

        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }

    @Override
    public UserVO updateUser(String username, String introduction) {
        String userId = BaseContext.getUserId();

        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("user is null");
        }

        userMapper.updateUserById(userId, username, introduction);


        if (username != null && !username.isEmpty()) {
            user.setUsername(username);
        }

        if (introduction != null && !introduction.isEmpty()) {
            user.setIntroduction(introduction);
        }

        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }

}
