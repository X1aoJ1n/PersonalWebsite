package com.bettercallxiaojin.home.service;

import com.bettercallxiaojin.home.pojo.VO.OrganizationVO;

import java.time.LocalDate;
import java.util.List;

public interface OrganizationService {

    OrganizationVO getOrganizationById(String id);

    List<OrganizationVO> getOrganizationByUserId(String id);

    List<OrganizationVO> updateOrganization(String id, String name, String type, LocalDate startDate, LocalDate endDate, String position, String description);

    List<OrganizationVO> addOrganization(String name, String type, LocalDate startDate, LocalDate endDate, String position, String description);

    List<OrganizationVO> deleteOrganization(String id);
}