package com.oddjobs.dtos.responses;

import com.oddjobs.entities.users.Prospect;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Data
public class ProspectResponseDto {
    private Long id;
    private String accountType;
    private String email;
    private String firstName;
    private String lastName;
    private String telephone;
    private String message;
    private  boolean enabled;
    private List<Map<String, Object>> permissions = new ArrayList<>();

    public ProspectResponseDto(Prospect user){
        if(user != null){
            setAccountType(user.getAccountRole());
            setEmail(user.getEmail());
            setTelephone(user.getTelephone());
            setFirstName(user.getFirstName());
            setLastName(user.getLastName());
            setTelephone(user.getTelephone());
        }
    }
}
