package com.bettercallxiaojin.home.pojo.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddOrganizationDTO {

    @NotBlank(message = "OrganizationType cannot be empty")
    private String type;

    @NotBlank(message = "OrganizationName cannot be empty")
    private String name;

    @NotNull(message = "startDate cannot be null")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotBlank(message = "Position cannot be empty")
    private String position;

    private String description;

    private String location;
}
