package com.oddjobs.dtos.responses;

import com.oddjobs.entities.StudentEntity;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class StudentResponseDTO implements Serializable {

    private Long id;
    private String firstName;
    private String lastName;
    private String middleName;
    private String fullName;
    private WalletResponseDTO wallet;
    private UserResponseDto primaryParent;
    private List<UserResponseDto> contributors;
    private SchoolResponseDTO school;
    private Long classId;
    private String className;

    public StudentResponseDTO(StudentEntity student, boolean showWallet){
        this.setId(student.getId());
        this.setLastName(student.getLastName());
        this.setFirstName(student.getFirstName());
        this.setMiddleName(student.getMiddleName()!=null ?student.getMiddleName():"");
        this.setFullName(String.format("%s %s %s", firstName, middleName, lastName));

        setClassId(student.getClassRoom().getId());
        setClassName(student.getClassRoom().getName());
        setSchool(new SchoolResponseDTO(student.getSchool()));
        if(showWallet){
            WalletResponseDTO w =  new WalletResponseDTO(student.getWalletAccount());
            setWallet(w);
        }
       if(student.getPrimaryParent() != null){
           UserResponseDto u = new UserResponseDto(student.getPrimaryParent(), false);
           u.setPrimary(true);
           this.setPrimaryParent(u);
       }
    }

}
