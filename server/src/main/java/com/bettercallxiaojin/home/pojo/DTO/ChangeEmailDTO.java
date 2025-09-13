package com.bettercallxiaojin.home.pojo.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "注册Request")
public class ChangeEmailDTO {

    @NotBlank(message = "Verification code cannot be empty")
    @Pattern(regexp = "^\\d{6}$", message = "Verification code must be 6 digits")
    private String code;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String email;
}
