package com.oddjobs.dtos.relworx.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class WebHookResponseData implements Serializable {
    private String status;
    private String message;
    private String customer_reference;
    private String internal_reference;
    private String msisdn;
    private Double amount;
    private String currency = "UGX";
    private String provider;
    private Double charge;
}
