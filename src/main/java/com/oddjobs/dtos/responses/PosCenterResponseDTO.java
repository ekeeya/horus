package com.oddjobs.dtos.responses;

import com.oddjobs.entities.PosCenterEntity;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class PosCenterResponseDTO implements Serializable {
    private Long id;
    private String name;
    private Long schoolId;
    private String schoolName;
    private String status;
    private List<POSAttendantResponseDTO> attendants = new ArrayList<>();

    public PosCenterResponseDTO(PosCenterEntity posCenter, boolean showAttendants){
        setId(posCenter.getId());
        setName(posCenter.getName());
        setSchoolId(posCenter.getSchool().getId());
        setSchoolName(posCenter.getSchool().getName());
        setStatus(posCenter.getEnabled() ? "Active" : "Inactive");
        if(showAttendants && posCenter.getAttendants()!=null){
            List<POSAttendantResponseDTO> ats =  posCenter.getAttendants().stream().map(POSAttendantResponseDTO::new).toList();
            setAttendants(ats);
        }
    }
}
