package com.oddjobs.dtos.requests;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class POSCenterRequestDTO implements Serializable {

    private  Long id; // for update
    @NotNull
    private String name;
    @NotNull
    private Long schoolId;

    private UserRequestDto attendant;
}
