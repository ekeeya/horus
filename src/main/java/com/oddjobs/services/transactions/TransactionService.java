/*
 * Online auctioning system
 *
 * Copyright (c) 2023.  Oddjobs an alias for the author of this software. - www.skycastleauctionhub.com
 *
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@oddjobs.tech <ekeeya@oddjobs.tech>.
 *
 * This program is not free software.
 *
 * NOTICE: All information contained herein is, and remains the property of Oddjobs. - www.oddjobs.tech
 */

package com.oddjobs.services.transactions;

import com.oddjobs.dtos.relworx.response.WebHookResponseData;
import com.oddjobs.dtos.requests.CallBackDataDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.entities.transactions.CashoutTransaction;
import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.exceptions.TransactionDoesNotExistException;
import com.oddjobs.utils.Utils;
import com.oddjobs.dtos.responses.TransactionResponseDTO;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.transactions.WithDrawTransaction;
import com.oddjobs.entities.wallets.SchoolCollectionAccount;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public interface TransactionService {
    Transaction recordPaymentTransaction(StudentWalletAccount account, BigDecimal amount, CashoutTransaction transaction);

    WithDrawTransaction recordDisbursementTransaction(WithdrawRequest request);

    WithDrawTransaction findByWithDrawRequest(WithdrawRequest request);
    <T extends MMTransaction> T findByMMTransactionRef(String ref);
    <T extends MMTransaction> T findByMMTransactionXrefId(String xReferenceId) ; // mtn
    <T extends MMTransaction> T findByMMTransactionTransactionId(String transactionId);
    Transaction findById(Long id) throws TransactionDoesNotExistException;
    Transaction findTransactionById(String transactionId);
    <T extends Transaction> T findTransactionByMMTransaction(MMTransaction t);
    void updateTransactionOnCallback(WebHookResponseData request) throws TransactionDoesNotExistException;
    List<PaymentTransaction> getPaymentsByAccountAndDateRange(StudentWalletAccount account, Date lowerDate, Date upperDate);
    BigDecimal calculateTotalTransactionsAmount(List<? extends  Transaction> transactions);
    Page<Transaction> findAll(int page, int size);
    Page<Transaction> findByType(Utils.TRANSACTION_TYPE type, int page, int size);
    byte[] writeRecordsToExcel(List<TransactionResponseDTO> transactions, String type);
    byte [] writeRecordsToCsv(Page<Transaction> page);
    byte [] writeRecordsToPDF(Page<Transaction> page);
    Double totalTransactionsByTypeAndStatus(Utils.TRANSACTION_TYPE type, Utils.TRANSACTION_STATUS status);
    Double totalTransactionsByTypeAndSchoolAndStatus(Utils.TRANSACTION_TYPE type, School school, Utils.TRANSACTION_STATUS status);
}
