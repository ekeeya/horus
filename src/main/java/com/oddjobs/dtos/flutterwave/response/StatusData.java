package com.oddjobs.dtos.flutterwave.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class StatusData implements Serializable {

    private Number id;
    private String tx_ref;
    private String flw_ref;
    private String device_fingerprint;
    private Double amount;
    private String currency;
    private Double charged_amount;
    private Double app_fee;
    private Double merchant_fee;
    private String processor_response;
    private String auth_model;
    private String ip;
    private String narration;
    private String status;
    private String payment_type;
    private String created_at;
    private Number account_id;
    private Object meta;
    private Double amount_settled;
    private StatusCustomer customer;

}
