package com.bettercallxiaojin.home.pojo.VO;

import com.bettercallxiaojin.home.pojo.entity.Contact;
import com.bettercallxiaojin.home.pojo.entity.Organization;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserVO {
    private String id;
    private String username;
    private String email;
    private String icon;
    private String introduction;
    private String background;
    private List<ContactVO> contacts;
    private List<OrganizationVO> organizations;
    private Integer followerCount;
    private Integer followingCount;
}
