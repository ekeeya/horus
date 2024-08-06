package com.oddjobs.dtos.requests;

import com.oddjobs.entities.WithdrawRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.List;


@Data
public class WithdrawRequestDTO implements Serializable {

    private Long id; // for update
    private Long accountId;
    private WithdrawRequest.Status status=WithdrawRequest.Status.PENDING;
    private WithdrawRequest.TYPE type = WithdrawRequest.TYPE.PAYMENTS; // can be cashouts
    private Long schoolId;
    private Double amount;
    private List<String> receipts; //upon marking processed, we shall upload receipts using base64 strings
}
