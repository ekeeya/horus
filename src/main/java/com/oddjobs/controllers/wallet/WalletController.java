package com.oddjobs.controllers.wallet;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.components.Mapper;
import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.dtos.requests.PaymentRequestDTO;
import com.oddjobs.dtos.requests.WalletDepositDTO;
import com.oddjobs.dtos.requests.WalletManagementRequestDTO;
import com.oddjobs.dtos.responses.StudentResponseDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
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
import com.oddjobs.services.schools.SchoolService;
import com.oddjobs.services.wallet.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/wallet")
public class WalletController {

    private final WalletService walletService;
    private final SchoolService schoolService;
    private final ContextProvider contextProvider;
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

    @PostMapping("/deposit")
    @Secured({"ROLE_PARENT"})
    public ResponseEntity<?> depositToWallet(@Valid @RequestBody WalletDepositDTO request, BindingResult result){
        BaseResponse response;
        try{
            response = new BaseResponse(result);
            if (response.isSuccess()){
                CollectionTransaction collectionTransaction =  walletService.depositIntoWallet(request);
                response.setMessage(String.format("Deposit of UGX: %s has been made", request.getAmount()));
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

}
