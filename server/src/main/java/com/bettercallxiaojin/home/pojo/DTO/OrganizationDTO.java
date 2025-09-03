package com.bettercallxiaojin.home.pojo.DTO;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
}
