package com.oddjobs.dtos.requests;

import lombok.Data;

import java.io.Serializable;
import java.util.Map;

@Data
public class ApprovalResponseDTO implements Serializable {
    private Long id;
    private boolean isApproved;
    private Map<String, Object> student;
}
