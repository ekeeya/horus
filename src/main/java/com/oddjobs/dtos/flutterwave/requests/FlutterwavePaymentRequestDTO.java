package com.oddjobs.dtos.flutterwave.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FlutterwavePaymentRequestDTO {

    private String phone_number;
    private String network;
    private Double amount;
    private String currency="UGX";
    private String email;
    private String tx_ref;

}
