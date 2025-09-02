package com.bettercallxiaojin.home.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Organization {
    private String id;
    private String userId;
    private String OrganizationType;
    private String OrganizationName;
    private LocalDateTime OrganizationStartDate;
    private LocalDateTime OrganizationEndDate;
    private String Position;
}