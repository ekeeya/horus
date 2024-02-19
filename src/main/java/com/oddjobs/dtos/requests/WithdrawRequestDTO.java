package com.oddjobs.dtos.requests;

import com.oddjobs.entities.WithdrawRequest;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class WithdrawRequestDTO implements Serializable {

    private Long id; // for update
    private WithdrawRequest.Status status;
    private Long schoolId;
    private Double amount;
    private List<String> receipts; //upon marking processed, we shall upload receipts using base64 strings
}
