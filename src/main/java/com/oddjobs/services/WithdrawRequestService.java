package com.oddjobs.services;

import com.oddjobs.dtos.requests.CashOutRequestDTO;
import com.oddjobs.dtos.requests.WithdrawRequestDTO;
import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.exceptions.StudentNotFoundException;

public interface WithdrawRequestService {


    WithdrawRequest createWithdrawRequest(WithdrawRequestDTO request) throws Exception;

    WithdrawRequest cancelRequest(Long requestId);

    WithdrawRequest approveRequest(Long requestId);

    WithdrawRequest markProcessed(WithdrawRequestDTO request);

    StudentWalletAccount cashOut(CashOutRequestDTO request) throws Exception;
}
