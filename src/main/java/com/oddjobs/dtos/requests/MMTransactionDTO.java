package com.oddjobs.dtos.requests;

import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;


@Data
public class MMTransactionDTO implements Serializable {

    private String transactionId;

    private String msisdn;

    private Utils.TRANSACTION_STATUS status =  Utils.TRANSACTION_STATUS.PENDING;

    private String currency = "UGX";

    private Utils.TRANSACTION_TYPE transactionType = Utils.TRANSACTION_TYPE.COLLECTION;

    private String description;

    private BigDecimal amount=new BigDecimal(0);

    private String responseCode;

    private String xReferenceId;
    private String reference;

    private Utils.PROVIDER provider;
    private String redirectUrl; // flutterwave

    public MMTransactionDTO(){
        long random = (long) (Math.random() * 100000000000000000L);
        String referenceId = String.format("REF%s", random);
        setXReferenceId(referenceId);
        setReference(referenceId);
        setTransactionId(referenceId);
    }

}
