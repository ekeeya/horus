package com.oddjobs.dtos.relworx.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class RelworxPaymentResponseDTO implements Serializable {

    private Boolean success;
    private String message;
    private String internal_reference;
}
