package com.bettercallxiaojin.home.pojo.VO;

import com.bettercallxiaojin.home.pojo.entity.Contact;
import com.bettercallxiaojin.home.pojo.entity.Organization;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginVO {
    private String id;
    private String token;
    private String username;
    private String email;
    private String icon;
    private String introduction;
    private List<Contact> contacts;
    private List<Organization> organizations;
}