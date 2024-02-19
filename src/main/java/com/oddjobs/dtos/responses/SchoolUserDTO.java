package com.oddjobs.dtos.responses;

import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SchoolUserDTO extends UserResponseDto{

    private SchoolResponseDTO school;
    private String department;

    @Override
    public String toString() {
        return "SchoolUserDTO{" +
                "school=" + school.getName() +
                ", department='" + department + '\'' +
                '}';
    }

    public SchoolUserDTO(User user) {
        super(user);
        setSchool(new SchoolResponseDTO(((SchoolUser) user).getSchool()));
        setDepartment(((SchoolUser) user).getDepartment());
    }
}
