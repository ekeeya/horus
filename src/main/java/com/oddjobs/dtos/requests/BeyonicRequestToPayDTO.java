package com.oddjobs.dtos.requests;

import lombok.Data;

import java.io.Serializable;

@Data
public class BeyonicRequestToPayDTO implements Serializable {
    private String phonenumber;
    private String first_name;
    private String last_name;
    private Double amount;
    private String currency="UGX";
    private String reason;
    private BeyonicMetadata metadata;
    private String success_message;
    private Boolean send_instructions=true;
    private String instructions;
    private String expiry_date="10 minutes";
}
