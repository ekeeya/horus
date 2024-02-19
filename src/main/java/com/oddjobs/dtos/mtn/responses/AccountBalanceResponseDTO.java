
package com.oddjobs.dtos.mtn.responses;

import lombok.Data;

import java.io.Serializable;

@Data
public class AccountBalanceResponseDTO implements Serializable {
    private Double availableBalance;
    private String currency;
}
