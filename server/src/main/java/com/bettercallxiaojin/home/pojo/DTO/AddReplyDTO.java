package com.bettercallxiaojin.home.pojo.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddReplyDTO {

    @NotBlank(message = "postId cannot be null")
    private String commentId;

    private String replyTo;

    @NotBlank(message = "content cannot be null")
    private String content;
}
