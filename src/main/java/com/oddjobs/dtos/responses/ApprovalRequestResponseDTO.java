package com.oddjobs.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.oddjobs.entities.approvals.ApprovalRequest;
import com.oddjobs.entities.approvals.ParentApprovalRequest;
import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class ApprovalRequestResponseDTO implements Serializable {
    private Long id;
    private Utils.APPROVAL_TYPES type;
    private Boolean isApproved;
    private ParentUserDTO primaryParent;
    private ParentUserDTO madeBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lastModifiedAt;
    private StudentResponseDTO student;
    private ApprovalRequest.Status status;

    public ApprovalRequestResponseDTO(ApprovalRequest request){
        setId(request.getId());
        setType(request.getType());
        setIsApproved(request.getIsApproved());
        setStudent(new StudentResponseDTO(request.getStudent(), false));
        setStatus(request.getStatus());
        setCreatedAt(request.getCreatedAt());
        setLastModifiedAt(request.getLastModifiedAt());
        setMadeBy(new ParentUserDTO(request.getMadeBy()));
        if(request instanceof ParentApprovalRequest){
            setPrimaryParent(new ParentUserDTO(request.getPrimaryParent()));
        }
    }
}
