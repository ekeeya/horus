package com.oddjobs.dtos.relworx.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
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
    private String remote_ip;
    private String provider_transaction_id;
}
