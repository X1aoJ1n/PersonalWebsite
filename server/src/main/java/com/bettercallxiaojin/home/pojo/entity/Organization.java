package com.bettercallxiaojin.home.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Organization {
    private String id;
    private String userId;
    private String type;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String position;
    private String description;
    private String location;
}