package com.oddjobs.services;

import com.oddjobs.dtos.requests.WithdrawRequestDTO;
import com.oddjobs.entities.WithdrawRequest;

public interface WithdrawRequestService {

    WithdrawRequest createWithdrawRequest(WithdrawRequestDTO request) throws Exception;

    WithdrawRequest cancelRequest(Long requestId);

    WithdrawRequest approveRequest(Long requestId);

    WithdrawRequest markProcessed(WithdrawRequestDTO request);
}
