package com.bettercallxiaojin.home.pojo.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddPostDTO {
    @NotBlank(message = "title cannot be empty")
    private String title;

    private String preview;

    @NotBlank(message = "content cannot be empty")
    private String content;
}
