package com.bettercallxiaojin.home.pojo.DTO;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {

    @Size(min = 1, max = 20, message = "Username must be between 1 and 20 characters")
    private String username;


    @Size(max = 500, message = "Username must be smaller than 500 characters")
    private String introduction;
}
