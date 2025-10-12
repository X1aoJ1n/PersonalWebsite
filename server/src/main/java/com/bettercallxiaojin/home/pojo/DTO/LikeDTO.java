package com.bettercallxiaojin.home.pojo.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeDTO {
    @NotNull(message = "targetType cannot be empty")
    @Min(1)
    @Max(3)
    private Integer targetType;

    @NotBlank(message = "targetId cannot be empty")
    private String targetId;
}
