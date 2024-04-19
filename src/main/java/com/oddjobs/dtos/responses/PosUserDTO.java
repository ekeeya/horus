package com.oddjobs.dtos.responses;

import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.users.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PosUserDTO extends UserResponseDto{

    private PosCenterResponseDTO posCenter;

    public PosUserDTO(User user) {
        super(user, true);
        PosCenterEntity pos =  ((POSAttendant) user).getPosCenter();
        if(pos != null){
            setPosCenter(new PosCenterResponseDTO(pos, false));
        }
    }
}
