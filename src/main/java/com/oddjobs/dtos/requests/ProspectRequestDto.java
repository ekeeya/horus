package com.oddjobs.dtos.requests;

import com.oddjobs.utils.Utils;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class ProspectRequestDto implements Serializable {

    private Long id;
    @NotNull
    private String accountRole;
    @NotNull
    private String email;
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;
    @NotNull
    private String telephone;
    private String message;


    public ProspectRequestDto(){};

    public ProspectRequestDto(Long id, @NotNull String accountRole, @NotNull Utils.ROLES role, String email, @NotNull String firstName, @NotNull String lastName, @NotNull String telephone, String message) {
        this.id = id;
        this.accountRole = accountRole;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.telephone = telephone;
        this.message = message;
    }
}
