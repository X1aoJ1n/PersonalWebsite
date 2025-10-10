package com.bettercallxiaojin.home.pojo.VO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class OrganizationVO {
    private String id;
    private String type;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String position;
    private String description;
    private String location;
}
