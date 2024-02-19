package com.oddjobs.dtos.responses;

import com.oddjobs.entities.ClassRoom;
import lombok.Data;

import java.io.Serializable;

@Data
public class ClassRoomResponseDTO implements Serializable {
    private Long id;
    private String name;
    private String school;
    private Long value;
    private String label;

    public ClassRoomResponseDTO(ClassRoom classRoom){
        this.id=classRoom.getId();
        this.name = classRoom.getName();
        this.value=classRoom.getId();
        this.label=classRoom.getName();
        this.school =  classRoom.getSchool().getName();
    }
}
