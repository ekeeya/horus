package com.oddjobs.controllers.admin;

import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.dtos.requests.CardProvisioningMarkRequest;
import com.oddjobs.entities.CardProvisionRequest;
import com.oddjobs.repositories.wallet.CardProvisionRequestRepository;
import com.oddjobs.dtos.responses.CardProvisionRequestResponse;
import com.oddjobs.services.wallet.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/")
public class AdminTasksController {

    private final WalletService walletService;
    private final CardProvisionRequestRepository cardProvisionRequestRepository;

    @GetMapping("provisioning/requests")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> getCardProvisioningRequests(
            @RequestParam(name="schoolId", required = false) Long schoolId,
            @RequestParam(name="provisioned", defaultValue = "false") boolean provisioned,
            @RequestParam(name="cardNo", required = false) String cardNo,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size
    ){
        try{
            ListResponseDTO<CardProvisionRequestResponse> response;
            Page<CardProvisionRequest> requests;
            if(cardNo !=null){
                requests = walletService.findRequestByCardNo(cardNo);
            }
            else if (schoolId != null){
                requests =  walletService.findProvisioningRequestsBySchoolAndStatus(schoolId, provisioned,  page, size);
            }else{
                requests =  walletService.findByStatus(provisioned, page, size);
            }
            response =  new ListResponseDTO<>(requests.getContent().stream().map(CardProvisionRequestResponse::new).toList(), requests.getTotalPages());
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
    @PostMapping("mark-provisioned")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> markProvisioned(
            @Valid @RequestBody CardProvisioningMarkRequest request
            ){
        try{
            ListResponseDTO<CardProvisionRequestResponse> response;
            List<CardProvisionRequestResponse> requests = walletService.markProvisioned(request).stream().map(CardProvisionRequestResponse::new).toList();
            response =  new ListResponseDTO<>(requests,1);
            return ResponseEntity.ok(response);

        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
