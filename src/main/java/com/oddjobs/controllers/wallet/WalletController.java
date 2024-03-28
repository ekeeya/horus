package com.oddjobs.controllers.wallet;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.components.Mapper;
import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.dtos.requests.PaymentRequestDTO;
import com.oddjobs.dtos.requests.UpdateWalletRequest;
import com.oddjobs.dtos.requests.WalletDepositDTO;
import com.oddjobs.dtos.requests.WalletManagementRequestDTO;
import com.oddjobs.dtos.responses.AccountResponseDTO;
import com.oddjobs.dtos.responses.StudentResponseDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.SchoolPaymentAccount;
import com.oddjobs.exceptions.ExceedDailyExpenditureException;
import com.oddjobs.exceptions.InsufficientBalanceException;
import com.oddjobs.exceptions.WalletAccountNotFoundException;
import com.oddjobs.exceptions.WrongWalletStatusException;
import com.oddjobs.entities.transactions.CollectionTransaction;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.dtos.responses.TransactionResponseDTO;
import com.oddjobs.dtos.responses.WalletResponseDTO;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.repositories.transactions.TransactionRepository;
import com.oddjobs.repositories.wallet.SchoolPaymentAccountRepository;
import com.oddjobs.repositories.wallet.WalletAccountRepository;
import com.oddjobs.services.schools.SchoolService;
import com.oddjobs.services.students.StudentService;
import com.oddjobs.services.wallet.WalletService;
import com.oddjobs.utils.Utils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.oddjobs.utils.Utils.TRANSACTION_STATUS.SUCCESS;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/wallet")
public class WalletController {
    private final TransactionRepository transactionRepository;
    private final SchoolPaymentAccountRepository schoolPaymentAccountRepository;

    private final WalletService walletService;
    private final WalletAccountRepository walletAccountRepository;
    private final SchoolService schoolService;
    private final ContextProvider contextProvider;
    private final StudentService studentService;
    private final Mapper mapper;


    @GetMapping("accounts")
    public ResponseEntity<?> getWalletAccounts(
            @RequestParam(value = "school", required = false) Long schoolId,
            @RequestParam(value="cardIssued", required = false) boolean cardIssued,
            @RequestParam(value = "cardNo", required = false) String cardNo, // this will be the card no
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ){
        ListResponseDTO<WalletResponseDTO> response = new ListResponseDTO<>();
        List<WalletResponseDTO> accounts;
        try{
            Page<StudentWalletAccount> p;
            if (schoolId !=null){
                School school = schoolService.findById(schoolId);
                p =  walletService.findBySchoolAndCardIssued(school, cardIssued, page, size);
                accounts = p.getContent().stream().map(WalletResponseDTO::new).toList();
                response.setEntries(accounts);
                response.setLimit(p.getSize());
                response.setOffset(page+1);
            }
            if(cardNo != null){
                StudentWalletAccount acc =  walletService.findByCardNo(cardNo);
                if(acc !=null){
                    response.setEntries(List.of(new WalletResponseDTO(acc)));
                    response.setLimit(1);
                    response.setOffset(1);
                }
            }
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("account/{cardNo}")
    public ResponseEntity<?> getWalletAccountByCardNo(
            @PathVariable(name="cardNo") String cardNo
    ){
        try{
            BaseResponse response =  new BaseResponse();
            StudentWalletAccount acc =  walletService.findByCardNo(cardNo);
            if(acc !=null){
                User u =  contextProvider.getPrincipal();
                if (u instanceof SchoolUser){
                    if(!((SchoolUser) u).getSchool().getId().equals(acc.getStudent().getSchool().getId())){
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No permissions to carry out this action");
                    }
                }
                if (u instanceof POSAttendant){
                    if(!((POSAttendant) u).getSchool().getId().equals(acc.getStudent().getSchool().getId())){
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No permissions to carry out this action");
                    }
                }
                StudentResponseDTO student =  mapper.toStudentDTO(acc.getStudent(),true);
                response.setData(student);
                return ResponseEntity.ok(response);
            }
            throw  new WalletAccountNotFoundException();
        }catch ( Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/wallet-top-up")
    @Secured({"ROLE_SCHOOL"})
    public ResponseEntity<?> updateWalletBalance(@Valid @RequestBody UpdateWalletRequest request, BindingResult result){
        BaseResponse response;
        try{
            response = new BaseResponse(result);
            if(response.isSuccess()){
                AccountEntity account = walletService.findByCardNo(request.getCardNo());
                WalletDepositDTO r = new WalletDepositDTO();
                r.setCardNo(request.getCardNo());
                r.setAmount(request.getAmount());
                r.setIsSystem(true);
                CollectionTransaction t = walletService.depositIntoWallet(r);
                String successMsg = String.format("Wallet account with cardNo: %s has been topped up to [%s]", request.getCardNo(), account.getBalance().toString());
                StudentResponseDTO s =  mapper.toStudentDTO(t.getReceiver(), true);
                response.setMessage(successMsg);
                response.setData(s);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e){
            response = new BaseResponse(e);
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(response);
        }
    }
    @PostMapping("/deposit")
    @Secured({"ROLE_PARENT"})
    public ResponseEntity<?> depositToWallet(@Valid @RequestBody WalletDepositDTO request, BindingResult result){
        BaseResponse response;
        try{
            response = new BaseResponse(result);
            if (response.isSuccess()){
                CollectionTransaction collectionTransaction =  walletService.depositIntoWallet(request);
                if (collectionTransaction == null){
                    throw new Exception("Involved mobile money transaction failed.");
                }
                response.setMessage(String.format("Deposit of UGX: %s is being processed, please enter your PIN in the prompt that comes to your phone to proceed.", request.getAmount()));
                response.setData(new TransactionResponseDTO(collectionTransaction));
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e){
            response =  new BaseResponse(e);
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/make-payment")
    @Secured({"ROLE_POS"})
    public ResponseEntity<?> processPayment(@Valid @RequestBody PaymentRequestDTO request, BindingResult result){
            try{
                BaseResponse response = new BaseResponse(result);
                if(response.isSuccess()){
                    Transaction transaction = walletService.processPayment(request);
                    response.setData(new TransactionResponseDTO(transaction));
                    return ResponseEntity.ok(response);
                }
                return ResponseEntity.badRequest().body(response);
            }
            catch (WalletAccountNotFoundException | WrongWalletStatusException | InsufficientBalanceException |
                   ExceedDailyExpenditureException e){
                return ResponseEntity.badRequest().body(e.getMessage());
            }
            catch (Exception e){
                log.error(e.getMessage(),e);
                return ResponseEntity.internalServerError().body(e.getMessage());
            }
    }

    @PostMapping("wallet-management")
    @Secured({"ROLE_ADMIN", "ROLE_SCHOOL"})
    public ResponseEntity<?> walletAccountManagement(@Valid @RequestBody WalletManagementRequestDTO request, BindingResult result){
        try{
            BaseResponse response = new BaseResponse(result);
            if  (response.isSuccess()){
                StudentEntity student = walletService.suspendDisableActivateWalletAccount(request.getWalletId(),request.getSuspensionLiftDate(), request.getStatus());
                StudentResponseDTO s =  mapper.toStudentDTO(student, true);
                return ResponseEntity.ok(s);
            }
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }


    @GetMapping("/virtual-accounts")
    @Secured({"ROLE_ADMIN", "ROLE_SCHOOL"})
    public ResponseEntity<?> findVirtualWalletAccounts(
            @RequestParam(name = "schoolId", required = false) Long schoolId
    ){
        try{
            BaseResponse response = new BaseResponse();
            List<AccountEntity> accounts;
            School school=null;
            if (schoolId != null){
                school =  schoolService.findById(schoolId);
            }
            User u =  contextProvider.getPrincipal();
            if (u instanceof SchoolUser){
                school = ((SchoolUser) u).getSchool();
            }
            if (school != null){
                accounts = (List<AccountEntity>) walletService.findVirtualAccountBySchool(school);
            }else{
                List<Utils.WALLET_ACCOUNT_TYPES> types = List.of(Utils.WALLET_ACCOUNT_TYPES.SYSTEM);
                accounts = walletAccountRepository.findAccountEntitiesByAccountTypeIn(types);
            }
            List<AccountResponseDTO> cleanAccounts = accounts.stream().map(AccountResponseDTO::new).toList();
            response.setData(cleanAccounts);
            response.setSuccess(true);
            response.setStatusCode(200);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/allowed-withdraw-amount")
    @Secured({"ROLE_SCHOOL"})
    public ResponseEntity<?> findAllowedWithdrawPaymentsAmount (
            @RequestParam(name="lowerDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date lowerDate,
            @RequestParam(name="upperDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date upperDate
    ){
        try{
            User u =  contextProvider.getPrincipal();
            SchoolUser  user =  (SchoolUser) u; // user will always be school user by the time we reach this point.
            BaseResponse response = new BaseResponse();
            School school  =  user.getSchool();
            double allowedBalance;
            SchoolPaymentAccount paymentAccount =  schoolPaymentAccountRepository.findSchoolWalletAccountBySchool(school);
            if (lowerDate == null){
                allowedBalance = paymentAccount.getBalance().doubleValue();
            }else{
                allowedBalance = transactionRepository.sumByTransactionTypeAndSchoolAndCreatedAtBetweenStatus(
                        Utils.TRANSACTION_TYPE.PAYMENT,school,lowerDate, upperDate, SUCCESS);
                if (allowedBalance > paymentAccount.getBalance().doubleValue()){
                    // if it is greater than return the account balance figure
                    allowedBalance =  paymentAccount.getBalance().doubleValue();
                }
            }
            response.setStatusCode(200);
            response.setSuccess(true);
            response.setData(allowedBalance);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }


}
