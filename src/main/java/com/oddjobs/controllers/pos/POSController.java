package com.oddjobs.controllers.pos;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.dtos.requests.POSAttendantAttachRequestDTO;
import com.oddjobs.dtos.requests.POSCenterRequestDTO;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.repositories.pos.PosCenterRepository;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.dtos.responses.PosCenterResponseDTO;
import com.oddjobs.dtos.responses.TransactionResponseDTO;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.users.User;
import com.oddjobs.services.pos.POSService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/")
public class POSController {

    private final POSService posService;
    private final PosCenterRepository posCenterRepository;
    private final ContextProvider contextProvider;

    @PostMapping("register-pos-center")
    @Secured({"ROLE_SCHOOL", "ROLE_ADMIN"})
    public ResponseEntity<?> registerPosCenter(
            @Valid @RequestBody POSCenterRequestDTO request, BindingResult result
    ) {
        try {
            BaseResponse response = new BaseResponse(result);
            if (response.isSuccess()) {
                User user =  contextProvider.getPrincipal();
                if(user instanceof SchoolUser){
                    if(!((SchoolUser) user).getSchool().getId().equals(request.getSchoolId())){
                        log.warn(String.format("%s is trying to add pos center to a school they do not belong to %s", user.getUsername(), ((SchoolUser) user).getSchool().getName()));
                        throw new AccessDeniedException("Not allowed");
                    }
                }
                PosCenterEntity posCenter = posService.registerPOSCenter(request);
                response.setData(new PosCenterResponseDTO(posCenter, true));
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("add-remove-pos-attendant")
    @Secured({"ROLE_SCHOOL", "ROLE_ADMIN"})
    public ResponseEntity<?> attachDetachPosAttendantToPOS(
            @Valid @RequestBody POSAttendantAttachRequestDTO request, BindingResult result
    ) {
        try {
            BaseResponse response = new BaseResponse(result);
            if (response.isSuccess()) {
                List<POSAttendant> attendants =  new ArrayList<>();
                PosCenterEntity posCenter =  posService.findById(request.getPosCenterId());
                for (Long attendantId:request.getAttendants()) {
                    POSAttendant attendant = posService.findAttendantById(attendantId);
                    posService.addRemoveAttendantToPosCenter(posCenter, attendant, request.isAdd());
                    attendants.add(attendant);
                }
                String action = request.isAdd() ? "attached to" : "detached from";
                response.setMessage(String.format("%s attendants have been %s pos center %s", attendants.size(),action,posCenter.getName()));
            }
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
    @GetMapping("pos-centers")
    @Secured({"ROLE_SCHOOL", "ROLE_ADMIN"})
    public ResponseEntity<?> getPosCenters(
            @RequestParam(name="schoolId", required = false) Long schoolId
    ){
        try{
            User user = contextProvider.getPrincipal();
            List<PosCenterResponseDTO> posCenters =  new ArrayList<>();
            if(user instanceof  SchoolUser){
                schoolId = ((SchoolUser) user).getSchool().getId();
            }
            if( schoolId!=null){
                posCenters = posService.getPosCentersbySchool(schoolId).stream().map(r->new PosCenterResponseDTO(r, true)).toList();
            }else{
                Pageable pageable = PageRequest.of(0, 10, Sort.by("id").descending());
                posCenters =  posCenterRepository.findAll(pageable).stream().map(r->new PosCenterResponseDTO(r, true)).toList();
            }
            ListResponseDTO<PosCenterResponseDTO> response = new ListResponseDTO<>(posCenters, posCenters.size());
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return  ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
    @GetMapping("pos-center-transactions")
    @Secured({"ROLE_SCHOOL", "ROLE_ADMIN"})
    public ResponseEntity<?> getPosCenterTransactions(
            @RequestParam(name="posCenterId", required = false)Long posCenterId,
            @RequestParam(name="lowerDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date lowerDate,
            @RequestParam(name="upperDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date upperDate,
            @RequestParam(name="attendant", required = false) Long attendantId,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size
            ){
        try{
            Page<PaymentTransaction> result;
            if(attendantId == null){
                result=  posService.fetchPaymentsByPosCenter(posCenterId,lowerDate,upperDate,page,size);
            }else {
                result = posService.fetchPaymentsByAttendant(attendantId,lowerDate, upperDate, page, size);
            }
            ListResponseDTO<TransactionResponseDTO>  response = new ListResponseDTO<>(result.stream().map(TransactionResponseDTO::new).toList(), result.getTotalElements());
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
