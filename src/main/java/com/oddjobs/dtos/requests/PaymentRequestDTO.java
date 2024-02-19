package com.oddjobs.dtos.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class PaymentRequestDTO implements Serializable {
    @NotNull
    private Double amount;
    @NotNull
    private String cardNo;
}
