package com.oddjobs.dtos.easypay.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class EasyPayCallBackDTO  implements Serializable {

    private String phone;
    private String reference;
    private String transactionId;
    private Double amount;
    private String reason;
}
