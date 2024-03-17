package com.oddjobs.controllers.finance;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.dtos.requests.CashOutRequestDTO;
import com.oddjobs.dtos.requests.WithdrawRequestDTO;
import com.oddjobs.dtos.responses.StudentResponseDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.exceptions.ResourceFobidenException;
import com.oddjobs.repositories.WithdrawRequestRepository;
import com.oddjobs.services.WithdrawRequestService;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.services.schools.SchoolService;
import com.oddjobs.dtos.responses.WithdrawRequestResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/finance")
public class WithdrawRequestController {

    private final WithdrawRequestRepository withdrawRequestRepository;
    private final WithdrawRequestService withdrawRequestService;
    private final ContextProvider contextProvider;
    private final SchoolService schoolService;

    @PostMapping("/withdraw-requests/create")
    @Secured({"ROLE_SCHOOL"})
    public ResponseEntity<?> createWithDrawRequest(
            @Valid @RequestBody WithdrawRequestDTO request, BindingResult result){
        try{
            BaseResponse response =  new BaseResponse(result);
            if(response.isSuccess()){
                User user = contextProvider.getPrincipal();
                if(user instanceof SchoolUser){
                        request.setSchoolId(((SchoolUser) user).getSchool().getId());
                }
                WithdrawRequest r =  withdrawRequestService.createWithdrawRequest(request);
                WithdrawRequestResponseDTO res =  new WithdrawRequestResponseDTO(r);
                response.setData(res);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/pocket-money-cashout")
    @Secured({"ROLE_SCHOOL"})
    public ResponseEntity<?> processCashout(
            @Valid @RequestBody CashOutRequestDTO request, BindingResult result){
        try{
            BaseResponse response =  new BaseResponse(result);
            if(response.isSuccess()){
                StudentWalletAccount r =  withdrawRequestService.cashOut(request);
                StudentResponseDTO res =  new StudentResponseDTO(r.getStudent(), true);
                response.setData(res);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/withdraw-requests/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_SCHOOL"})
    public ResponseEntity<?> getWithDrawRequest(
            @PathVariable(name="id")String referenceNo
    ){
        try{
           WithdrawRequest request =  withdrawRequestRepository.findByReferenceNo(referenceNo);
           if (request != null){
               User user = contextProvider.getPrincipal();
               if(user instanceof SchoolUser){
                   if(!((SchoolUser) user).getSchool().getId().equals(request.getSchool().getId())){
                       throw  new ResourceFobidenException("You are not authorized to view details of this request");
                   }
               }
               BaseResponse response =  new BaseResponse();
               WithdrawRequestResponseDTO r = new WithdrawRequestResponseDTO(request);
               response.setData(r);
               return ResponseEntity.ok(response);
           }
           return ResponseEntity.badRequest().body(String.format("Withdraw request with referenceNo %s does not exist", referenceNo));


        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/withdraw-requests")
    public ResponseEntity<?> getWithdrawRequests(
            @RequestParam(name="schoolId", required = false) Long schoolId,
            @RequestParam(name="referenceNo", required = false) String referenceNo,
            @RequestParam(name="status", required = false) WithdrawRequest.Status status,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size
    ){
        try{
            User user = contextProvider.getPrincipal();
            if(user instanceof SchoolUser){
                schoolId =  ((SchoolUser) user).getSchool().getId();
            }
            List<WithdrawRequestResponseDTO> requests =  new ArrayList<>();
            Page<WithdrawRequest> p = null ;
            int pages=1;
            Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
            if(schoolId != null){
                School school =  schoolService.findById(schoolId);
                if(status != null){
                    p = withdrawRequestRepository.findWithdrawRequestsBySchoolAndStatus(school,status, pageable);
                }else{
                    p = withdrawRequestRepository.findWithdrawRequestsBySchool(school, pageable);
                }

            }else if(referenceNo != null){
                WithdrawRequest r =  withdrawRequestRepository.findByReferenceNo(referenceNo);
                requests.add(new WithdrawRequestResponseDTO(r));
            } else if (status != null) {
                p = withdrawRequestRepository.findWithdrawRequestsByStatus(status, pageable);
            } else{
                List<WithdrawRequest.Status> statuses = List.of(WithdrawRequest.Status.PENDING, WithdrawRequest.Status.APPROVED);
                p =  withdrawRequestRepository.findWithdrawRequestsByStatusIn(statuses, pageable);
            }
            if(p != null){
                requests = p.getContent().stream().map(WithdrawRequestResponseDTO::new).toList();
                pages = p.getTotalPages();
            }
            ListResponseDTO<WithdrawRequestResponseDTO> response =  new ListResponseDTO<>(requests, pages);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/approve-cancel/{id}")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> approveCancel(
            @PathVariable(name = "id") Long requestId,
            @RequestParam(name = "action") String action
    ){
        try{
            WithdrawRequestResponseDTO request;
            if (Objects.equals(action, "approve")){
                request =  new WithdrawRequestResponseDTO(withdrawRequestService.approveRequest(requestId));
            }else{
                request =  new WithdrawRequestResponseDTO(withdrawRequestService.cancelRequest(requestId));
            }
            BaseResponse response =  new BaseResponse();
            response.setData(request);
            response.setMessage(String.format("Withdraw request id %s has been %sed", requestId, action));
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }


    @PostMapping("/mark-processed")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> markProcessed(
            @Valid @RequestBody WithdrawRequestDTO request
    ){
        try{
            WithdrawRequestResponseDTO r = new WithdrawRequestResponseDTO(withdrawRequestService.markProcessed(request));
            BaseResponse response =  new BaseResponse();
            response.setData(r);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
