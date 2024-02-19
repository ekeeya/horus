package com.oddjobs.dtos.responses;

import com.oddjobs.entities.users.POSAttendant;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class POSAttendantResponseDTO extends UserResponseDto implements Serializable {
    private Long posCenterId;
    private String posCenterName;


    public POSAttendantResponseDTO(POSAttendant u){
        super(u);
        setPosCenterId(u.getPosCenter().getId());
        setPosCenterName(u.getPosCenter().getName());
    }

}
