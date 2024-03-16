package com.oddjobs.dtos.relworx.requests;

import com.oddjobs.dtos.requests.BaseRequestToPay;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class RelworxRequestToPayDTO extends BaseRequestToPay {
    private String account_no;
    private String currency="UGX";
    private String description;
    private String msisdn;
}
