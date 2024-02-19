package com.oddjobs.dtos.flutterwave.requests;

import com.oddjobs.dtos.requests.BaseRequestToPay;
import lombok.Data;

@Data
public class FlutterwaveRequestToPayDTO extends BaseRequestToPay {
    private String phone_number;
    private String email;
}
