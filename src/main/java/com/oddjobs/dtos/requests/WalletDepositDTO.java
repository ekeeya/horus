package com.oddjobs.dtos.requests;
import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;

@Data
public class WalletDepositDTO implements Serializable {
    private String msisdn;
    private String cardNo;
    private Long studentId;
    private Double amount;
    private Utils.ENV env;
}
