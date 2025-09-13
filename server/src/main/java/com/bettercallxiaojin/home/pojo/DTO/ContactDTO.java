package com.bettercallxiaojin.home.pojo.DTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactDTO {

    @NotEmpty
    private String id;

    private String type;

    private String data;
}
