package com.oddjobs.services;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.requests.CashOutRequestDTO;
import com.oddjobs.dtos.requests.PaymentRequestDTO;
import com.oddjobs.dtos.requests.WithdrawRequestDTO;
import com.oddjobs.entities.transactions.CashoutTransaction;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.SchoolPaymentAccount;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.exceptions.InsufficientBalanceException;
import com.oddjobs.exceptions.ResourceFobidenException;
import com.oddjobs.exceptions.WalletAccountNotFoundException;
import com.oddjobs.repositories.BaseEntityRepository;
import com.oddjobs.repositories.WithdrawRequestRepository;
import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.entities.transactions.WithDrawTransaction;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.entities.wallets.SchoolCollectionAccount;
import com.oddjobs.repositories.wallet.SchoolCollectionAccountRepository;
import com.oddjobs.repositories.wallet.SchoolPaymentAccountRepository;
import com.oddjobs.repositories.wallet.SchoolWithdrawAccountRepository;
import com.oddjobs.repositories.wallet.StudentWalletAccountRepository;
import com.oddjobs.services.transactions.TransactionService;
import com.oddjobs.entities.Image;
import com.oddjobs.entities.Notification;
import com.oddjobs.entities.School;
import com.oddjobs.repositories.transactions.TransactionRepository;
import com.oddjobs.services.schools.SchoolService;
import com.oddjobs.services.wallet.WalletService;
import com.oddjobs.utils.Utils;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class WithdrawRequestServiceImpl implements WithdrawRequestService{
    private final StudentWalletAccountRepository studentWalletAccountRepository;

    private final WithdrawRequestRepository withdrawRequestRepository;
    private final SchoolService schoolService;
    private final SchoolCollectionAccountRepository schoolCollectionAccountRepository;
    private final SchoolWithdrawAccountRepository schoolWithdrawAccountRepository;
    private final SchoolPaymentAccountRepository schoolPaymentAccountRepository;
    private final NotificationService notificationService;
    private final WalletService walletService;
    private final ContextProvider contextProvider;
    private final BaseEntityRepository baseEntityRepository;
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final EntityManager entityManager;

    @Value("${application.default.currency}")
    private String DEFAULT_CURRENCY;
    @Override
    public WithdrawRequest createWithdrawRequest(WithdrawRequestDTO request) throws Exception {
        User user = contextProvider.getPrincipal();
        if(user instanceof SchoolUser){
            WithdrawRequest withdrawRequest = new WithdrawRequest();
            School school =  schoolService.findById(request.getSchoolId());
            List<WithdrawRequest.Status> statuses = List.of(WithdrawRequest.Status.PENDING, WithdrawRequest.Status.APPROVED);
            Double amountInPendingWithdraw = withdrawRequestRepository.sumWithdrawRequestsByStatusInAndSchool(statuses, school);
            AccountEntity debitAccount;
            AccountEntity creditAccount;
            if (request.getType() == WithdrawRequest.TYPE.PAYMENTS){
                creditAccount = schoolWithdrawAccountRepository.findSchoolWalletAccountBySchool(school);
                debitAccount = schoolPaymentAccountRepository.findSchoolWalletAccountBySchool(school);
            }else{
                creditAccount = schoolWithdrawAccountRepository.findSchoolWalletAccountBySchool(school);
                debitAccount = schoolCollectionAccountRepository.findSchoolWalletAccountBySchool(school);
            }
            withdrawRequest.setDebitAccount(debitAccount);
            withdrawRequest.setCreditAccount(creditAccount);
            // check if one Already pending
            if(withdrawRequestRepository.countBySchoolAndStatus(school, WithdrawRequest.Status.PENDING) > 0){
                throw new Exception(String.format("This school %s already has a pending withdraw request", school.getName()));
            }
            SchoolPaymentAccount account =  schoolPaymentAccountRepository.findSchoolWalletAccountBySchool(school);
            if (request.getAmount() > (account.getBalance().doubleValue() + amountInPendingWithdraw)){
                throw new InsufficientBalanceException(request.getAmount(), account.getName());
            }
            withdrawRequest.setSchool(school);
            withdrawRequest.setStatus(request.getStatus());
            withdrawRequest.setType(request.getType());
            withdrawRequest.setAmount(BigDecimal.valueOf(request.getAmount()));
            withdrawRequest =  withdrawRequestRepository.save(withdrawRequest);
            String msg = String.format("A withdraw request has been created by %s on behalf of %s", user.fullName(),((SchoolUser) user).getSchool().getName());
            notificationService.createNotification(Notification.Type.WITHDRAW_REQUEST, withdrawRequest.getId(), Notification.Action.Create, msg);
            // create Transaction
            WithDrawTransaction transaction = transactionService.recordDisbursementTransaction(withdrawRequest);
            log.info(String.format("Disbursement transaction has been created %s", transaction));
            return withdrawRequest;
        }
        throw new ResourceFobidenException(String.format("Only users with role %s are allowed to carry out this action", Utils.ROLES.ROLE_SCHOOL));
    }

    @Override
    public WithdrawRequest cancelRequest(Long requestId) {

        WithdrawRequest request =  withdrawRequestRepository.findById(requestId).get();
        request.setStatus(WithdrawRequest.Status.CANCELLED);
        WithDrawTransaction t = transactionService.findByWithDrawRequest(request);
        t.setStatus(Utils.TRANSACTION_STATUS.CANCELLED);
        transactionRepository.save(t);
        return withdrawRequestRepository.save(request);
    }

    @Override
    public WithdrawRequest approveRequest(Long requestId) {
        WithdrawRequest request =  withdrawRequestRepository.findById(requestId).get();
        request.setStatus(WithdrawRequest.Status.APPROVED);
        String msg = String.format("Withdraw request with reference No. %s has been APPROVED for processing.",request.getReferenceNo());
        notificationService.createNotification(Notification.Type.WITHDRAW_REQUEST,request.getId(),Notification.Action.Approve,msg);
        return withdrawRequestRepository.save(request);
    }

    @Override
    @Transactional
    public WithdrawRequest markProcessed(WithdrawRequestDTO request) {
        WithdrawRequest r =  withdrawRequestRepository.findById(request.getId()).get();
        int count = 0;
        List<Image> images = new ArrayList<>();
        for(String base64String: request.getReceipts()){
            count+=1;
            Image image =  new Image();
            image.setName(String.format("Receipt-%s-%s", r.getReferenceNo(),count));
            String[] strings = base64String.split(",");
            image.setFileType(strings[0]);
            image.setContent(strings[1]);
            images.add(baseEntityRepository.save(image));
        }
        r.setReceipts(images);
        r.setStatus(WithdrawRequest.Status.PROCESSED);
        withdrawRequestRepository.save(r);
        // update school account

        // update transaction
        WithDrawTransaction transaction =  transactionService.findByWithDrawRequest(r);
        transactionRepository.updateTransactionStatus(Utils.TRANSACTION_STATUS.SUCCESS.toString(), transaction.getId()); // will prompt the balance update db trigger
        String msg = String.format("Withdraw request with reference No. %s has been processed successfully.",r.getReferenceNo());
        log.info(msg);
        notificationService.createNotification(Notification.Type.WITHDRAW_REQUEST,request.getId(),Notification.Action.Processed,msg);
        return r;
    }

    @Override
    @Transactional
    public StudentWalletAccount cashOut(CashOutRequestDTO request) throws Exception {
        StudentWalletAccount studentWalletAccount;
        User user = contextProvider.getPrincipal();
        // search for it by studentId first
        try{
            studentWalletAccount = walletService.findByCardNo(request.getCardNo());
        }catch ( WalletAccountNotFoundException e){
            studentWalletAccount = walletService.findByStudentId(request.getStudentId());
        }
        if(user instanceof SchoolUser){
            if (!Objects.equals(((SchoolUser) user).getSchool().getId(), studentWalletAccount.getStudent().getSchool().getId())){
                throw new ResourceFobidenException("You do not have permissions to cashout this account");
            }
        }
        if (BigDecimal.valueOf(request.getAmount()).compareTo(studentWalletAccount.getBalance()) > 0){
                throw new InsufficientBalanceException(studentWalletAccount.getBalance().doubleValue(), studentWalletAccount.getCardNo());
        }

        if (studentWalletAccount.getStatus() != Utils.WALLET_STATUS.ACTIVE){
            throw new ResourceFobidenException("Account is not active");
        }
        log.info("Entering cash-out transaction for: {}",studentWalletAccount);
        // create the cash-out transaction
        CashoutTransaction transaction =  new CashoutTransaction();
        transaction.setDebitAccount(studentWalletAccount);
        transaction.setAmount(BigDecimal.valueOf(request.getAmount()));
        transaction.setCurrency(DEFAULT_CURRENCY);
        School school = studentWalletAccount.getStudent().getSchool();
        transaction.setSchool(school);
        transaction.setStatus(Utils.TRANSACTION_STATUS.SUCCESS);
        transaction.setDescription("Cash-out transaction, yeah they want their money.");
        transaction.setTransactionId(Utils.generateTransactionId());
        transaction.setNature(Utils.TRANSACTION_NATURE.DEBIT);
        transaction = transactionRepository.save(transaction);
        // Create a payment transaction
        PaymentRequestDTO paymentRequest =  new PaymentRequestDTO();
        paymentRequest.setAmount(request.getAmount());
        paymentRequest.setCardNo(studentWalletAccount.getCardNo());
        paymentRequest.setCashOutTransactionId(transaction.getId());
        walletService.processPayment(paymentRequest);
        log.info("Successfully cashed-out on account: {}",studentWalletAccount);
        return studentWalletAccount;
    }
}
