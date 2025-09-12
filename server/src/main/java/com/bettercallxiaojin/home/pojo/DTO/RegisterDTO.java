package com.bettercallxiaojin.home.pojo.DTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "注册Request")
public class RegisterDTO {

    @NotBlank(message = "Verification code cannot be empty")
    @Pattern(regexp = "^\\d{6}$", message = "Verification code must be 6 digits")
    private String code;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, max = 50, message = "Password must be between 6 and 50 characters")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).+$",
            message = "Password must contain at least one letter and one number")
    private String password;

    @NotBlank(message = "Confirm password cannot be empty")
    private String confirmPassword;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 1, max = 20, message = "Username must be between 1 and 20 characters")
    private String username;

}
