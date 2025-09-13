package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.mapper.ContactMapper;
import com.bettercallxiaojin.home.mapper.UserMapper;
import com.bettercallxiaojin.home.pojo.VO.ContactVO;
import com.bettercallxiaojin.home.pojo.VO.OrganizationVO;
import com.bettercallxiaojin.home.pojo.entity.Contact;
import com.bettercallxiaojin.home.pojo.entity.Organization;
import com.bettercallxiaojin.home.pojo.entity.User;
import com.bettercallxiaojin.home.service.ContactService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactMapper contactMapper;
    private final UserMapper userMapper;


    @Override
    public ContactVO getContactById(String id) {
        Contact contact = contactMapper.selectById(id);
        ContactVO contactVO = new ContactVO();
        BeanUtils.copyProperties(contact, contactVO);
        return contactVO;
    }

    @Override
    public List<ContactVO> getContactByUserId(String id) {

        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("user is null");
        }

        List<Contact> contacts = contactMapper.selectByUserId(id);

        List<ContactVO> contactVOS = new ArrayList<>();

        for (Contact contact : contacts) {
            ContactVO contactVO = new ContactVO();
            BeanUtils.copyProperties(contact, contactVO);
            contactVOS.add(contactVO);
        }

        return contactVOS;
    }

    @Override
    public List<ContactVO> updateContact(String id, String type, String data) {

        Contact contact = contactMapper.selectById(id);

        log.info(contact.toString());
        if (!(contact.getUserId().equals(BaseContext.getUserId()))) {
            throw new RuntimeException("cannot change organization of others");
        }

        contact.setType(type);
        contact.setData(data);

        try {
            contactMapper.update(contact);
        } catch (Exception e) {
            throw new RuntimeException("insert organization failed: " + e.getMessage());
        }

        return getContactByUserId(BaseContext.getUserId());
    }

    @Override
    public List<ContactVO> addContact(String type, String data) {
        Contact contact = new Contact();
        contact.setType(type);
        contact.setData(data);
        contact.setUserId(BaseContext.getUserId());

        String id =  UUID.randomUUID().toString();
        contact.setId(id);


        try {
            contactMapper.insert(contact);
        } catch (Exception e) {
            throw new RuntimeException("insert organization failed: " + e.getMessage());
        }

        return getContactByUserId(BaseContext.getUserId());

    }


    @Override
    public List<ContactVO> deleteContact(String id) {
        String userId = BaseContext.getUserId();
        Contact contact = contactMapper.selectById(id);
        if (contact == null) {
            throw new RuntimeException("contact is null");
        }

        if (!(userId.equals(contact.getUserId()))) {
            throw new RuntimeException("cannot delete contact of others");
        }

        try {
            contactMapper.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("delete organization failed: " + e.getMessage());
        }
        return getContactByUserId(BaseContext.getUserId());
    }
}
