package com.oddjobs.dtos.relworx.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class RelworxPaymentRequestDTO implements Serializable {

    private String account_no;
    private String reference;
    private Double amount;
    private String currency="UGX";
    private String description;
    private String msisdn;

}
