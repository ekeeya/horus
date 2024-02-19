package com.oddjobs.dtos.easypay.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EasyPaymentRequestDTO {

    private String username;
    private String password;
    private String action;
    private Double amount;
    private String currency="UGX";
    private String phone;
    private String reference;
    private String reason;

}
