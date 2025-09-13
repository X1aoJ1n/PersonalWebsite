package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.ContactVO;

import java.util.List;

public interface ContactService {

    ContactVO getContactById(String id);

    List<ContactVO> getContactByUserId(String id);

    List<ContactVO> updateContact(String id, String type, String data);

    List<ContactVO> addContact(String type, String data);

    List<ContactVO> deleteContact(String id);
}