package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.mapper.OrganizationMapper;
import com.bettercallxiaojin.home.mapper.UserMapper;
import com.bettercallxiaojin.home.pojo.VO.OrganizationVO;
import com.bettercallxiaojin.home.pojo.entity.Organization;
import com.bettercallxiaojin.home.pojo.entity.User;
import com.bettercallxiaojin.home.service.OrganizationService;
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
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationMapper organizationMapper;
    private final UserMapper userMapper;


    @Override
    public OrganizationVO getOrganizationById(String id) {
        Organization organization = organizationMapper.selectById(id);
        OrganizationVO organizationVO = new OrganizationVO();
        BeanUtils.copyProperties(organization, organizationVO);
        return organizationVO;
    }

    @Override
    public List<OrganizationVO> getOrganizationByUserId(String id) {

        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("user is null");
        }

        List<OrganizationVO> organizations = organizationMapper.selectVOByUserId(id);

        return organizations;
    }

    @Override
    public List<OrganizationVO> updateOrganization(String id, String name, String type, LocalDate startDate, LocalDate endDate, String position, String description, String location) {

        Organization organization = organizationMapper.selectById(id);

        log.info(organization.toString());
        if (!(organization.getUserId().equals(BaseContext.getUserId()))) {
            throw new RuntimeException("cannot change organization of others");
        }

        organization.setName(name);
        organization.setType(type);
        organization.setStartDate(startDate);
        organization.setEndDate(endDate);
        organization.setPosition(position);
        organization.setDescription(description);
        organization.setLocation(location);

        if (organization.getEndDate() != null) {
            if (organization.getStartDate().isAfter(organization.getEndDate())) {
                throw new RuntimeException("start date can't be after end date");
            }
        }

        try {
            organizationMapper.update(organization);
        } catch (Exception e) {
            throw new RuntimeException("insert organization failed: " + e.getMessage());
        }

        return getOrganizationByUserId(BaseContext.getUserId());
    }

    @Override
    public List<OrganizationVO> addOrganization(String name, String type, LocalDate startDate, LocalDate endDate, String position, String description, String location) {
        Organization organization = new Organization();
        organization.setName(name);
        organization.setType(type);
        organization.setStartDate(startDate);
        organization.setEndDate(endDate);
        organization.setPosition(position);
        organization.setDescription(description);
        organization.setLocation(location);
        organization.setUserId(BaseContext.getUserId());

        String id =  UUID.randomUUID().toString();
        organization.setId(id);


        try {
            organizationMapper.insert(organization);
        } catch (Exception e) {
            throw new RuntimeException("insert organization failed: " + e.getMessage());
        }

        return getOrganizationByUserId(BaseContext.getUserId());

    }

    @Override
    public List<OrganizationVO> deleteOrganization(String id) {
        String userId = BaseContext.getUserId();
        Organization organization = organizationMapper.selectById(id);

        if  (organization == null) {
            throw new RuntimeException("organization is null");
        }
        if (!(userId.equals(organization.getUserId()))) {
            throw new RuntimeException("cannot delete organization of others");
        }

        try {
            organizationMapper.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("delete organization failed: " + e.getMessage());
        }
        return getOrganizationByUserId(BaseContext.getUserId());
    }
}
