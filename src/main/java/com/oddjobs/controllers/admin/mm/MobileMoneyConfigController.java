package com.oddjobs.controllers.admin.mm;

import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.requests.CallBackDataDTO;
import com.oddjobs.dtos.requests.MobileMoneyProductConfigDTO;
import com.oddjobs.services.SettingService;
import com.oddjobs.utils.Utils;
import com.oddjobs.dtos.easypay.response.EasyPayCallBackDTO;
import com.oddjobs.dtos.flutterwave.response.WebHookResponseData;
import com.oddjobs.repositories.mm.APIUserRepository;
import com.oddjobs.services.mm.MobileMoneyService;
import com.oddjobs.services.transactions.TransactionService;
import com.oddjobs.dtos.responses.ApiUserResponseDTO;
import com.oddjobs.entities.mm.APIUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Transactional
@Slf4j
@RequestMapping("/api/v1/mm")
public class MobileMoneyConfigController {

    private final MobileMoneyService mobileMoneyService;
    private final APIUserRepository apiUserRepository;
    private final SettingService settingService;
    private final TransactionService transactionService;

    @PostMapping("mobile-money-config")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<BaseResponse> configureProduct(
            @RequestBody @Valid MobileMoneyProductConfigDTO request, BindingResult result){
        BaseResponse response = new BaseResponse(result);
        try{
            if(response.isSuccess()){
                Long id =  mobileMoneyService.configureMobileMoneyInTransaction(request);
                APIUser user =  apiUserRepository.findById(id).get();
                ApiUserResponseDTO apiUserResponseDTO =  new ApiUserResponseDTO(user);
                String message = String.format("Mobile money %s  product has been configured and API initialization", user.getProduct().getName());
                response.setMessage(message);
                response.setData(apiUserResponseDTO);
                log.info(String.valueOf(response));
                return  ResponseEntity.ok(response);
            }
            response.setData(result.getAllErrors());
            response.setSuccess(false);
            response.setMessage("Failure");
            log.warn(String.valueOf(response));
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e){
            response =  new BaseResponse(e);
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("set-provider")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> setProvider(
            @RequestParam(name="provider") Utils.PROVIDER_TYPES providerType
    ){
        try{
            settingService.updateProvider(providerType);
            return ResponseEntity.ok("Mobile money provider has been updated");
        }catch (Exception e){
            return  ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/callback/flutter-wave")
    public ResponseEntity<?> flutterWaveCallback(
            @RequestBody WebHookResponseData request){
        try{
            log.info("Received a transaction callback from Flutter wave: {}", request);
            String txRef =  request.getData().getTx_ref();
            Double amount = request.getData().getAmount();
            Double appfee =  request.getData().getApp_fee();
            String status =  request.getData().getStatus().toUpperCase();
            Utils.TRANSACTION_STATUS s = status.equals("SUCCESSFUL") ? Utils.TRANSACTION_STATUS.SUCCESS: Utils.TRANSACTION_STATUS.FAILED;
            CallBackDataDTO response =  new CallBackDataDTO(txRef,null, Utils.PROVIDER.FLUTTER_WAVE,amount,appfee,s.toString(), request);
            transactionService.updateTransactionOnCallback(response);
            return ResponseEntity.ok().body("OK");
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/callback/easy-pay")
    public ResponseEntity<?> easyPayCallback(
            @RequestBody EasyPayCallBackDTO request
    ){
        try{
            log.info("Received a transaction callback from EasyPay");
            String transactionId = request.getTransactionId();
            String reference = request.getReference();
            Double amount = request.getAmount();
            Double charge = 0.03 * amount;  // TODO should be configured
            CallBackDataDTO response =  new CallBackDataDTO(reference,transactionId, Utils.PROVIDER.EASY_PAY,amount,charge,"SUCCESS",request);
            transactionService.updateTransactionOnCallback(response);
            return ResponseEntity.ok().body("OK");
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
