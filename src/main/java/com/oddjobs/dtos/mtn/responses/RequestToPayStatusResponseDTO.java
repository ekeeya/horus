package com.oddjobs.dtos.mtn.responses;


import lombok.Data;

import java.io.Serializable;


@Data
public class RequestToPayStatusResponseDTO implements Serializable {


    public static enum MOMO_TRANS_STATUS{
        SUCCESSFUL, PENDING, FAILED, EXPIRED
    }
    private String financialTransactionId;
    private MOMO_TRANS_STATUS status;
    private String externalId;
    private Object payer;
    private Object reason;
    private String currency;
    private String payerMessage;
    private String payeeNote;
    private Double amount;



}
