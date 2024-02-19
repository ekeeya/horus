package com.oddjobs.dtos.requests;
import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;


@Data
public class CallBackDataDTO implements Serializable {

    private String xRef;
    private String transactionId;
    private Utils.PROVIDER provider;
    private Double amount;
    private Double charge;
    private String status;
    private Object payload;

    public CallBackDataDTO(String xRef, String transactionId, Utils.PROVIDER provider, Double amount, Double charge, String status, Object payload) {
        this.xRef = xRef;
        this.transactionId = transactionId;
        this.provider = provider;
        this.amount = amount;
        this.charge = charge;
        this.payload=payload;
        switch (status.toLowerCase()) {
            case "successful", "success" -> this.status = "SUCCESS";
            case "failed" -> this.status = "FAILED";
            default -> this.status = "PENDING";
        }

    }

    @Override
    public String toString() {
        return "CallBackDataDTO{" +
                "xRef='" + xRef + '\'' +
                ", transactionId='" + transactionId + '\'' +
                '}';
    }
}
