package com.oddjobs.services;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.requests.CashOutRequestDTO;
import com.oddjobs.dtos.requests.WithdrawRequestDTO;
import com.oddjobs.entities.transactions.CashoutTransaction;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.exceptions.InsufficientBalanceException;
import com.oddjobs.exceptions.ResourceFobidenException;
import com.oddjobs.exceptions.StudentNotFoundException;
import com.oddjobs.exceptions.WalletAccountNotFoundException;
import com.oddjobs.repositories.BaseEntityRepository;
import com.oddjobs.repositories.WithdrawRequestRepository;
import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.entities.transactions.WithDrawTransaction;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.entities.wallets.SchoolWalletAccount;
import com.oddjobs.repositories.wallet.SchoolWalletAccountRepository;
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
    private final SchoolWalletAccountRepository schoolWalletAccountRepository;
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
            WithdrawRequest r = new WithdrawRequest();
            School school =  schoolService.findById(request.getSchoolId());
            // check if one Already pending
            if(withdrawRequestRepository.countBySchoolAndStatus(school, WithdrawRequest.Status.PENDING) > 0){
                throw new Exception(String.format("This school %s already has a pending withdraw request", school.getName()));
            }
            SchoolWalletAccount account =  walletService.findWalletBySchool(school);
            if (request.getAmount() > account.getBalance().doubleValue()){
                throw new InsufficientBalanceException(request.getAmount(), account.getName());
            }
            r.setSchool(school);
            r.setStatus(request.getStatus());
            r.setType(request.getType());
            r.setAmount(BigDecimal.valueOf(request.getAmount()));
            r =  withdrawRequestRepository.save(r);
            String msg = String.format("A withdraw request has been created by %s on behalf of %s", user.fullName(),((SchoolUser) user).getSchool().getName());
            notificationService.createNotification(Notification.Type.WITHDRAW_REQUEST, r.getId(), Notification.Action.Create, msg);
            // create Transaction
            WithDrawTransaction transaction = transactionService.recordDisbursementTransaction(account,r);
            log.info(String.format("Disbursement transaction has been created %s", transaction));
            return r;
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
        log.info("Entering cash-out transaction for: {}",studentWalletAccount);
        // create the cash-out transaction
        // For cash-out transactions, we shall debit the student account right away, but do not touch the system
        // collections and school collections until money is actually withdrawn by MM.
        CashoutTransaction transaction =  new CashoutTransaction();
        transaction.setDebitAccount(studentWalletAccount);
        transaction.setAmount(BigDecimal.valueOf(request.getAmount()));
        transaction.setCurrency(DEFAULT_CURRENCY);
        School school = studentWalletAccount.getStudent().getSchool();
        transaction.setSchool(school);
        transaction.setDescription("Cash-out transaction, yeah they want their money.");
        transaction.setTransactionId(Utils.generateTransactionId());
        transaction.setNature(Utils.TRANSACTION_NATURE.DEBIT);
        transactionRepository.save(transaction);
        // now create the withdraw request and approve it
        WithdrawRequestDTO d =  new WithdrawRequestDTO();
        d.setStatus(WithdrawRequest.Status.APPROVED);
        d.setType(WithdrawRequest.TYPE.CASH_OUTS);
        d.setAmount(request.getAmount());
        d.setSchoolId(school.getId());
        createWithdrawRequest(d);
        // reduce the student account balance;
        BigDecimal balance = studentWalletAccount.getBalance().subtract(BigDecimal.valueOf(request.getAmount()));
        studentWalletAccount.setBalance(balance);
        studentWalletAccount =studentWalletAccountRepository.save(studentWalletAccount);
        log.info("Successfully cashed-out on account: {}",studentWalletAccount);
        return studentWalletAccount;
    }
}
