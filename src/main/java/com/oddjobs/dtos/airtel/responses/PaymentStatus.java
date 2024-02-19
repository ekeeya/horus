package com.oddjobs.dtos.airtel.responses;

import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;

@Data
public class PaymentStatus implements Serializable {
    private String code;
    private String message;
    private String result_code;
    private Utils.AIRTEL_CODES response_code;
    private Boolean success;
}
