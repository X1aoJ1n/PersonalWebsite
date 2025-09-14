package com.bettercallxiaojin.home.pojo.DTO;

import com.bettercallxiaojin.home.pojo.entity.Reply;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {

    @NotBlank(message = "id cannot be null")
    private String id;

    @NotBlank(message = "content cannot be null")
    private String content;
}
