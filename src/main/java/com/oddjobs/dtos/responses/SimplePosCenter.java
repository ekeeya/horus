package com.oddjobs.dtos.responses;

import com.oddjobs.entities.PosCenterEntity;
import lombok.Data;

import java.io.Serializable;

@Data
public class SimplePosCenter implements Serializable {
    private Long id;
    private String name;
    private Long schoolId;
    private String schoolName;

    public SimplePosCenter(PosCenterEntity pos){
        id=pos.getId();
        name= pos.getName();
        schoolId=pos.getSchool().getId();
        schoolName=pos.getSchool().getName();
    }
}
