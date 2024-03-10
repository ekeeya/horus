package com.oddjobs.services.wallet;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.airtel.requests.AirtelRequestToPayDTO;
import com.oddjobs.dtos.easypay.requests.EasyPayRequestToPayDTO;
import com.oddjobs.dtos.flutterwave.requests.FlutterwaveRequestToPayDTO;
import com.oddjobs.dtos.mtn.Payer;
import com.oddjobs.dtos.mtn.requests.MomoRequestToPayDTO;
import com.oddjobs.dtos.requests.BaseRequestToPay;
import com.oddjobs.dtos.requests.CardProvisioningMarkRequest;
import com.oddjobs.dtos.requests.PaymentRequestDTO;
import com.oddjobs.dtos.requests.WalletDepositDTO;
import com.oddjobs.entities.*;
import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.exceptions.*;
import com.oddjobs.repositories.mm.MMTransactionRepository;
import com.oddjobs.repositories.students.StudentRepository;
import com.oddjobs.repositories.transactions.TransactionRepository;
import com.oddjobs.repositories.wallet.CardProvisionRequestRepository;
import com.oddjobs.repositories.wallet.SchoolWalletAccountRepository;
import com.oddjobs.repositories.wallet.StudentWalletAccountRepository;
import com.oddjobs.repositories.wallet.WalletAccountRepository;
import com.oddjobs.services.NotificationService;
import com.oddjobs.services.SettingService;
import com.oddjobs.services.transactions.TransactionService;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.transactions.CollectionTransaction;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.CollectionAccount;
import com.oddjobs.entities.wallets.SchoolWalletAccount;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.services.mm.MobileMoneyService;
import com.oddjobs.services.schools.SchoolService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletServiceImpl implements WalletService {

    private final StudentRepository studentRepository;
    private  final SchoolService schoolService;
    private final MobileMoneyService mobileMoneyService;
    private final StudentWalletAccountRepository studentWalletAccountRepository;
    private final WalletAccountRepository walletAccountRepository;
    private final SchoolWalletAccountRepository schoolWalletAccountRepository;
    private final MMTransactionRepository mmTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;
    private final CardProvisionRequestRepository cardProvisionRequestRepository;
    private final NotificationService notificationService;
    private final ContextProvider contextProvider;
    private  final SettingService settingService;


    protected boolean exceedsDailyExpenditureLimit(StudentWalletAccount account){
        if (!account.getEnableDailyLimit()){
            return false;
        }
        BigDecimal limit =  account.getMaximumDailyLimit();
        // check for transactions made today that have this
        List<Date> dates = Utils.todayDates(null);
        List<PaymentTransaction> payments = transactionService.getPaymentsByAccountAndDateRange(account, dates.get(0), dates.get(1));
        BigDecimal totalTransactionsAmount =  transactionService.calculateTotalTransactionsAmount(payments);
        int compare = limit.compareTo(totalTransactionsAmount);
        // if we have hit the limit
        return compare > 0 || compare == 0;
    }
    @Override
    public StudentWalletAccount createStudentWalletAccount(StudentEntity student) {
        StudentWalletAccount walletAccount =  new StudentWalletAccount();
        walletAccount.setName(String.format("%s %s", student.getFirstName(), student.getLastName()));
        walletAccount.setStudent(student);
        return studentWalletAccountRepository.save(walletAccount);
    }

    @Override
    public StudentEntity suspendDisableActivateWalletAccount(Long  walletId, Date date, Utils.WALLET_STATUS status) throws WalletAccountNotFoundException {
        try{
            StudentWalletAccount wallet = (StudentWalletAccount) walletAccountRepository.findById(walletId).get();
            User u = contextProvider.getPrincipal();
            if(u instanceof SchoolUser){
                // we want to be sure of school user to manage cards
                if(!((SchoolUser) u).getSchool().equals(wallet.getStudent().getSchool())){
                 throw new Exception(String.format("User %s has no permissions to change this card status", u.getUsername()));
                }
            }
            switch (status){
                case ACTIVE, DISABLED, PENDING -> {
                    // set status wallet
                    wallet.setStatus(status);
                }
                default -> {
                    // this is suspending
                    if(date == null){
                        throw new Exception("Suspension of a wallet account requires a lift date which has not been provided");
                    }
                    wallet.setStatus(status);
                    wallet.setSuspensionLiftDate(date);
                }
            }
            walletAccountRepository.save(wallet);
            return wallet.getStudent();
        }catch (NoSuchElementException e){
            throw  new WalletAccountNotFoundException(String.format("Wallet account of id: %s not found in our records", walletId));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    @Value("${mm.api.provider.type}")
    private String mmProviderType;

    @Override
    public AccountEntity updateWalletBalance(AccountEntity account, Double amount) {
        log.info("Updating wallet balance by user: {}", contextProvider.getPrincipal());
        BigDecimal newAmount =  new BigDecimal(amount);
        BigDecimal balance =  account.getBalance();
        balance =  balance.add(newAmount); // parse a negative for debits
        account.setBalance(balance);
        return walletAccountRepository.save(account);
    }

    @Override
    public CollectionTransaction depositIntoWallet(WalletDepositDTO request) {
        try{
            log.info("Entered depositIntoWallet with data: {}", request);
            StudentWalletAccount wallet;
            StudentEntity student;
            if(request.getStudentId() != null){
                student =  studentRepository.findById(request.getStudentId()).get();
                wallet =  student.getWalletAccount();
            }else {
                wallet = findByCardNo(request.getCardNo());
                student =  wallet.getStudent();
            }
            if(wallet == null){
                throw new WalletAccountNotFoundException(String.format("Wallet account %s for student %s not found", request.getCardNo(), request.getStudentId()));
            }

            User user = contextProvider.getPrincipal();
            ParentUser parent = (ParentUser) user;
            BaseRequestToPay requestToPay;
            Settings settings = settingService.getSettings();
            if (settings != null){
                mmProviderType =  settings.getProvider().toString();
            }
            Utils.PROVIDER provider = Utils.PROVIDER.valueOf(mmProviderType);
            if (request.getIsSystem()){
                provider = Utils.PROVIDER.SYSTEM;
            }else{
                provider =  mobileMoneyService.isTelecom() ? mobileMoneyService.determineProvider(request.getMsisdn()) : Utils.PROVIDER.valueOf(mmProviderType);
            }

            String msisdn;
            CollectionTransaction transaction =  new CollectionTransaction();
            if (Objects.requireNonNull(provider) == Utils.PROVIDER.FLUTTER_WAVE) {
                msisdn = Utils.sanitizeMsisdn(request.getMsisdn(), Utils.PROVIDER.FLUTTER_WAVE);
                requestToPay = new FlutterwaveRequestToPayDTO();
                // get parent email
                ((FlutterwaveRequestToPayDTO) requestToPay).setEmail(parent.getEmail());
                ((FlutterwaveRequestToPayDTO) requestToPay).setPhone_number(msisdn);
                Long mmTransactionId = mobileMoneyService.initiateWalletTopUp(requestToPay, request.getEnv());
                MMTransaction t =  mmTransactionRepository.findById(mmTransactionId).get();
                requestToPay.setAmount(request.getAmount());
                requestToPay.setProvider(provider);
                transaction.setMmTransaction(t);
                transaction.setCurrency(t.getCurrency());
                transaction.setAmount(t.getAmount());
                transaction.setDescription(t.getDescription());
            }else{
                // It is a system deposit
                log.info("Making a system deposit to account: {} of UGX: {}", wallet, request.getAmount());
                transaction.setMmTransaction(null);
                transaction.setCurrency("UGX");
                transaction.setAmount(BigDecimal.valueOf(request.getAmount()));
                transaction.setDescription("TOP-UP from Bursary");
            }
            // Collection Transaction
            transaction.setReceiver(student);
            transaction.setSender(parent);
            transaction.setCreditAccount(student.getWalletAccount());
            transaction.setSchool(student.getSchool());
            transaction.setTransactionId(Utils.generateTransactionId());
            if (provider == Utils.PROVIDER.SYSTEM){
                transaction.setTotalPlusCharges(BigDecimal.valueOf(0));
                // this will create handle the balance update right?
                transactionRepository.updateTransactionStatus(Utils.TRANSACTION_STATUS.SUCCESS.toString(), transaction.getId());
                transactionRepository.save(transaction);
            }
            // DB trigger will handle the rest at this point
            log.info("Exiting depositIntoWallet with transaction: {}", transaction);

            return transactionRepository.save(transaction);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            throw new RuntimeException();
        }
    }

    @Override
    public boolean isActive(StudentWalletAccount walletAccount) {
        return walletAccount.getStatus().equals(Utils.WALLET_STATUS.ACTIVE);
    }

    @Override
    public StudentWalletAccount findByCardNo(String accNo) throws WalletAccountNotFoundException {
        StudentWalletAccount wallet =  studentWalletAccountRepository.findWalletAccountEntityByCardNo(accNo);
        if (wallet == null){
            throw new WalletAccountNotFoundException();
        }
        return wallet;
    }

    @Override
    public Page<StudentWalletAccount> findBySchool(School school) {
        return null;
    }

    @Override
    public CollectionAccount findCollectionAccount() {
        return (CollectionAccount) walletAccountRepository.findAccountEntityByAccountType(Utils.WALLET_ACCOUNT_TYPES.SYSTEM);
    }

    @Override
    public SchoolWalletAccount findWalletBySchool(School school) {
        return schoolWalletAccountRepository.findSchoolWalletAccountBySchool(school);
    }

    @Override
    public Page<StudentWalletAccount> findBySchoolAndCardIssued(School school, boolean cardIssued, int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return studentWalletAccountRepository.findStudentWalletAccountsByStudent_SchoolAndIsCardIssued(school, cardIssued, pageable);
    }

    @Override
    public Transaction processPayment(PaymentRequestDTO request) throws WalletAccountNotFoundException, InsufficientBalanceException, ExceedDailyExpenditureException, WrongWalletStatusException {
        StudentWalletAccount account = studentWalletAccountRepository.findWalletAccountEntityByCardNo(request.getCardNo());
        if (account == null){
            throw new WalletAccountNotFoundException(request.getCardNo());
        }
        if(!account.getStatus().equals(Utils.WALLET_STATUS.ACTIVE)){
            throw new WrongWalletStatusException(account.getStatus().toString(), account.getCardNo());
        }
        BigDecimal paymentAmount = BigDecimal.valueOf(request.getAmount());
        // check if account has enough balance.
        if (account.getBalance().compareTo(paymentAmount) < 0 ){
            throw  new InsufficientBalanceException(account.getBalance().toBigIntegerExact().doubleValue(), request.getAmount(),account.getCardNo());
        }
        if (exceedsDailyExpenditureLimit(account)){
            throw new ExceedDailyExpenditureException(account.getCardNo());
        }
        // check if card has no daily expenditure restrictions.
        account = (StudentWalletAccount) updateWalletBalance(account, -request.getAmount()); // debit parse negative
        // Record Payment transaction and return it.
        return transactionService.recordPaymentTransaction(account, paymentAmount);

    }

    @Override
    public Page<CardProvisionRequest> findByStatus(boolean provisioned, int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());

        return cardProvisionRequestRepository.findCardProvisionRequestsByProvisionedIs(provisioned, pageable);
    }

    @Override
    public void createCardProvisioningRequest(StudentEntity student) {
        CardProvisionRequest request;
        request =  cardProvisionRequestRepository.findCardProvisionRequestsByStudent_WalletAccount_CardNo(student.getWalletAccount().getCardNo());
        if(request == null){
            request = new CardProvisionRequest();
            request.setStudent(student);
            request = cardProvisionRequestRepository.save(request);
            // create a notification
            String msg = String.format("A new card provisioning request from %s from cardNo %s", student.getSchool().getName(), student.getWalletAccount().getCardNo());
            notificationService.createNotification(Notification.Type.CARD_PROVISIONING_REQUEST, request.getId(), Notification.Action.Create,msg);
        }
    }

    @Override
    public Page<CardProvisionRequest> findProvisioningRequestsBySchoolAndStatus(Long schoolId, boolean provisioned, int page, int size) throws SchoolNotFoundException {
        School school =  schoolService.findById(schoolId);
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return cardProvisionRequestRepository.findCardProvisionRequestsByStudent_SchoolAndProvisionedIs(school,provisioned,pageable);
    }

    @Override
    public Page<CardProvisionRequest> findRequestByCardNo(String cardNo) {
        Pageable pageable =  PageRequest.of(0, 10, Sort.by("id").descending());
        return cardProvisionRequestRepository.findCardProvisionRequestsByStudent_WalletAccount_CardNoLike(cardNo, pageable);
    }

    @Override
    public List<CardProvisionRequest> markProvisioned(CardProvisioningMarkRequest request) throws Exception {

        List<CardProvisionRequest> l = new ArrayList<>();
        if (request.getRequestId() !=  null){
            request.getRequestIds().add(request.getRequestId());
        }
        if (request.getRequestIds().size() > 0){
            for (Long id:request.getRequestIds()  ) {
                try{
                    CardProvisionRequest r =  cardProvisionRequestRepository.findById(id).get();
                    r.setProvisioned(true);
                    r = cardProvisionRequestRepository.save(r);
                    l.add(r);
                }catch (NoSuchElementException e){
                   log.warn(String.format("Card provisioning request id %s not found", id));
                }
            }
        } else {
            throw new Exception("Missing required request parameters");
        }
        return l;
    }
}
