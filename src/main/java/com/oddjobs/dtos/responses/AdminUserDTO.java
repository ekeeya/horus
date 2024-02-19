package com.oddjobs.dtos.responses;

import com.oddjobs.entities.users.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUserDTO extends UserResponseDto {
    public AdminUserDTO(User user) {
        super(user);
    }
}
