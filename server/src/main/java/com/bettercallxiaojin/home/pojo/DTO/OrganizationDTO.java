package com.bettercallxiaojin.home.pojo.DTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrganizationDTO {

    @NotEmpty
    private String id;

    private String type;

    private String name;

    private LocalDate startDate;

    private LocalDate endDate;

    private String position;

    private String description;

    private String location;

}
