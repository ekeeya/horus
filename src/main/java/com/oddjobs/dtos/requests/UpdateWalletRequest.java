package com.oddjobs.dtos.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class UpdateWalletRequest implements Serializable {
    @NotNull
    private String cardNo;

    @NotNull
    private Double amount;
}
