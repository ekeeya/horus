package com.oddjobs.dtos.requests;

import lombok.Data;

@Data
public class UpdateUserPasswordRequestDTO {
    private Long id;
    private String newPassword;
}
