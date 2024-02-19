
package com.oddjobs.dtos.mtn.requests;

import com.oddjobs.dtos.mtn.Payer;
import com.oddjobs.dtos.requests.BaseRequestToPay;
import lombok.Data;

@Data
public class MomoRequestToPayDTO extends BaseRequestToPay {
    private String externalId;
    private Payer payer;
    private String currency;
    private String payerMessage;
    private String payeeNote;
}
