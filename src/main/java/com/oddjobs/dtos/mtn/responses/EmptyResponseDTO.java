package com.oddjobs.dtos.mtn.responses;

import lombok.Data;

import java.io.Serializable;

@Data
public class EmptyResponseDTO implements Serializable {
    private Object response;
    private String xReferenceId;
}
