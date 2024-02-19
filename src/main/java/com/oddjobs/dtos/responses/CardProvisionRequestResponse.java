package com.oddjobs.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.oddjobs.entities.CardProvisionRequest;
import lombok.Data;

import java.util.Date;

@Data
public class CardProvisionRequestResponse {
    private Long id;
    private  StudentResponseDTO student;
    private boolean provisioned ;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    public CardProvisionRequestResponse(CardProvisionRequest request){
        setId(request.getId());
        setProvisioned(request.getProvisioned());
        setCreatedAt(request.getCreatedAt());
        setStudent(new StudentResponseDTO(request.getStudent(),true));
    }
}
