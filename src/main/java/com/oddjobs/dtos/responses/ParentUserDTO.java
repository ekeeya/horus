package com.oddjobs.dtos.responses;

import com.oddjobs.entities.users.User;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Setter
@Getter
public class ParentUserDTO extends  UserResponseDto{

    private List<StudentResponseDTO> students;

    public ParentUserDTO(User user) {
        super(user);
    }
}
