package com.bettercallxiaojin.home.pojo.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddContactDTO {

    @NotBlank(message = "ContactType cannot be empty")
    private String type;

    @NotBlank(message = "data cannot be empty")
    private String data;
}
