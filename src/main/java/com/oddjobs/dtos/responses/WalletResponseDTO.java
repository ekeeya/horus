package com.oddjobs.dtos.responses;

import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;

@Data
public class WalletResponseDTO implements Serializable {
    private Long id;
    private String cardNo = Utils.generateCardNumber();
    private Double balance = 0.0;

    private Double maximumDailyLimit= 0.0;

    private Boolean enableDailyLimit = false;
    private  Utils.WALLET_STATUS status;

    public WalletResponseDTO(StudentWalletAccount account){
        setId(account.getId());
        setStatus(account.getStatus());
        setCardNo(account.getCardNo());
        setBalance(account.getBalance().doubleValue());
        setMaximumDailyLimit(account.getMaximumDailyLimit().doubleValue());
        setEnableDailyLimit(account.getEnableDailyLimit());
    }
}
