package com.oddjobs.dtos.relworx.response;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RelworxPaymentResponseDTO implements Serializable {

    private Boolean success;
    private String message;
    private String internal_reference;
    private String error_code;
}
