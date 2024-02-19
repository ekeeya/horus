package com.oddjobs.dtos.requests;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.oddjobs.utils.Utils;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class WalletManagementRequestDTO implements Serializable {

    @NotNull
    private Long walletId;

    private String cardNo;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date suspensionLiftDate;

    @NotNull
    private Utils.WALLET_STATUS status;
}
