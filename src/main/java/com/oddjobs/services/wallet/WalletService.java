package com.oddjobs.services.wallet;

import com.oddjobs.dtos.requests.CardProvisioningMarkRequest;
import com.oddjobs.dtos.requests.PaymentRequestDTO;
import com.oddjobs.dtos.requests.WalletDepositDTO;
import com.oddjobs.entities.CardProvisionRequest;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.inventory.Order;
import com.oddjobs.exceptions.*;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.transactions.CollectionTransaction;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.CollectionAccount;
import com.oddjobs.entities.wallets.SchoolCollectionAccount;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import org.springframework.data.domain.Page;

import java.util.Date;
import java.util.List;

public interface WalletService {
    StudentWalletAccount createStudentWalletAccount(StudentEntity student);

    StudentEntity suspendDisableActivateWalletAccount(Long walletId, Date date, Utils.WALLET_STATUS status) throws WalletAccountNotFoundException;

    AccountEntity updateWalletBalance(AccountEntity account, Double amount);

    CollectionTransaction depositIntoWallet(WalletDepositDTO request) throws WalletAccountNotFoundException;

    boolean isActive(StudentWalletAccount walletAccount);

    StudentWalletAccount findByCardNo(String cardNo) throws WalletAccountNotFoundException;

    StudentWalletAccount findByStudentId(Long studentId) throws StudentNotFoundException;

    Page<StudentWalletAccount> findBySchool(School school);

    CollectionAccount findCollectionAccount();

    SchoolCollectionAccount findWalletBySchool(School school);

    Page<StudentWalletAccount> findBySchoolAndCardIssued(School School, boolean cardIssued, int page, int size);

    Utils.BiWrapper<Transaction, Order> processPayment(PaymentRequestDTO request) throws WalletAccountNotFoundException, InsufficientBalanceException, ExceedDailyExpenditureException, WrongWalletStatusException;

    Page<CardProvisionRequest> findByStatus(boolean provisioned, int page, int size);

    void createCardProvisioningRequest(StudentEntity student);

    Page<CardProvisionRequest> findProvisioningRequestsBySchoolAndStatus(Long schoolId, boolean provisioned, int page, int size) throws SchoolNotFoundException;

    Page<CardProvisionRequest> findRequestByCardNo(String cardNo);

    List<CardProvisionRequest> markProvisioned(CardProvisioningMarkRequest request) throws Exception;

    List<? extends AccountEntity> findVirtualAccountBySchool(School school);
}
