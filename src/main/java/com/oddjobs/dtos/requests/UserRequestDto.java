package com.oddjobs.dtos.requests;

import com.oddjobs.utils.Utils;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

@Data
public class UserRequestDto implements Serializable {

    private Long id;
    @NotNull
    private Utils.ACCOUNT_TYPE accountType;
    @NotNull
    private String username;

    @Size(min = 8, message = "Password length must be at least 8 characters")
    private String password;
    @NotNull
    private Utils.ROLES role;
    private String email;
    private String address;
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;
    private String middleName;
    @NotNull
    private String telephone;
    private Utils.GENDER gender;
    private boolean using2fa = false;
    private Long schoolId;
    private Long posCenterId;
    private String department;
    private boolean isSuperUser=false;

    public UserRequestDto(){};

    public UserRequestDto(Long id, @NotNull Utils.ACCOUNT_TYPE accountType, @NotNull String username, @NotNull String password, @NotNull Utils.ROLES role, String email, String address, @NotNull String firstName, @NotNull String lastName, String middleName, @NotNull String telephone, Utils.GENDER gender, boolean using2fa, Long schoolId, Long posCenterId, String department, boolean isSuperUser) {
        this.id = id;
        this.accountType = accountType;
        this.username = username;
        this.password = password;
        this.role = role;
        this.email = email;
        this.address = address;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.telephone = telephone;
        this.gender = gender;
        this.using2fa = using2fa;
        this.schoolId = schoolId;
        this.posCenterId = posCenterId;
        this.department = department;
        this.isSuperUser=isSuperUser;
    }
}
