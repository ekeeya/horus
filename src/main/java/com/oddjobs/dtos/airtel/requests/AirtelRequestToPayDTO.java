
package com.oddjobs.dtos.airtel.requests;


import com.oddjobs.dtos.requests.BaseRequestToPay;
import lombok.Data;

@Data
public class AirtelRequestToPayDTO extends BaseRequestToPay {
    private String msisdn;
}
