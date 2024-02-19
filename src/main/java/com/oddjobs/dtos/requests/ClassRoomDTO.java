package com.oddjobs.dtos.requests;
import lombok.Data;

import java.io.Serializable;

@Data
public class ClassRoomDTO implements Serializable {
    private String name;
    private Long school;

    public ClassRoomDTO(String name, Long school){
        this.name=name;
        this.school=school;
    }
}
