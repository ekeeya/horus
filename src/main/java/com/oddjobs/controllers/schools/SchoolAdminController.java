/*
 * Online auctioning system
 *
 * Copyright (c) 2023.  Oddjobs an alias for the author of this software. - www.skycastleauctionhub.com
 *
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@oddjobs.tech <ekeeya@oddjobs.tech>.
 *
 * This program is not free software.
 *
 * NOTICE: All information contained herein is, and remains the property of Oddjobs. - www.oddjobs.tech
 */

package com.oddjobs.controllers.schools;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.components.Mapper;
import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.dtos.requests.ClassRoomDTO;
import com.oddjobs.dtos.requests.ClassesRequestDTO;
import com.oddjobs.dtos.requests.SchoolRequestDTO;
import com.oddjobs.entities.ClassRoom;
import com.oddjobs.entities.School;
import com.oddjobs.entities.subscriptions.Subscription;
import com.oddjobs.repositories.school.SubscriptionRepository;
import com.oddjobs.services.schools.subscriptions.SubscriptionService;
import com.oddjobs.utils.Utils;
import com.oddjobs.dtos.responses.SchoolResponseDTO;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.services.schools.SchoolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
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
public class SchoolAdminController {

    private final SchoolService schoolService;
    private final ContextProvider contextProvider;
    private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;
    private final Mapper mapper;
    @PostMapping("class/register/{id}")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> registerClasses(
            @PathVariable(name="id") Long schoolId,
            @RequestBody ClassesRequestDTO request
    ){
        try{
            List<ClassRoom> rooms = new ArrayList<>();
            School school =  schoolService.findById(schoolId);
            for(String name: request.getClasses()){
                ClassRoomDTO dto =  new ClassRoomDTO(name, schoolId);
                ClassRoom c = schoolService.createClassRoom(dto);
                rooms.add(c);
            }
            ListResponseDTO<ClassRoom> response = new ListResponseDTO<>(rooms, rooms.size());
            response.setMessage(String.format("%s classes have been created for school %s", rooms.size(), school.getName()));
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return  ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("school/register")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<BaseResponse> registerSchool(@Valid @RequestBody SchoolRequestDTO request, BindingResult result) {
        BaseResponse response;
        try {
            response = new BaseResponse(result);
            if (response.isSuccess()) {
                Long schoolId = schoolService.register(request);
                School school =  schoolService.findById(schoolId);
                SchoolResponseDTO schoolResponseDTO =  mapper.toSchoolDto(school);
                response.setData(schoolResponseDTO);
                response.setMessage(schoolResponseDTO + " has been successfully registered");
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            response = new BaseResponse(e);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("schools")
    public ResponseEntity<ListResponseDTO<SchoolResponseDTO>> getSchools(
            @RequestParam(name="name", required = false) String name,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size
    )
    {
        ListResponseDTO<SchoolResponseDTO> results;
        List<School> schools;
        User user = contextProvider.getPrincipal();
        if(user instanceof SchoolUser){
            School school =  ((SchoolUser) user).getSchool();
            schools =  List.of(school);
            results =  new ListResponseDTO<>(schools.stream().map(mapper::toSchoolDto).toList(), schools.size());
        } else if (name != null) {
            Page<School> schoolsPage = schoolService.searchByNameLike(name, page, size);;
            results =  new ListResponseDTO<>(schoolsPage.getContent().stream().map(mapper::toSchoolDto).toList(), schoolsPage.getTotalPages());
        } else{
            Page<School> schoolsPage = schoolService.fetchAll(page, size);
            results =  new ListResponseDTO<>(schoolsPage.getContent().stream().map(mapper::toSchoolDto).toList(), schoolsPage.getTotalPages());
        }

        return ResponseEntity.ok(results);
    }

    @GetMapping("schools/{schoolId}")
    public ResponseEntity<?> getSchool(
            @PathVariable(name = "schoolId") Long schoolId
    ){
        try{
            School school =  schoolService.findById(schoolId);
            return ResponseEntity.ok(mapper.toSchoolDto(school));
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Something wrong happened on our servers");
        }
    }

    @GetMapping("set-commission-fee")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> setCommissionFee(
            @RequestParam(name="fee", required = false) Double fee,
            @RequestParam(name="schoolFee", required = false) Double schoolFee,
            @RequestParam(name="school") Long schoolId
    ){
        try{
            schoolService.setCommissionFee(schoolId, fee, schoolFee);
            return ResponseEntity.ok("OK");
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Something wrong happened on our servers");
        }
    }

    @GetMapping("schools/accounts")
    public ResponseEntity<?> manageSchoolAccounts(
            @RequestParam(name="schoolId") Long schoolId,
            @RequestParam(name="action") Utils.ACCOUNT_ACTIONS action
            ){
        try{
            schoolService.schoolAccountManagement(action,schoolId);
            return ResponseEntity.ok("OK");
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Something wrong happened on our servers");
        }
    }
    @GetMapping("subscription/activate/{schoolId}")
    public ResponseEntity<?> activateSubscription(
            @PathVariable("schoolId") Long schoolId,
            @RequestParam("term") Utils.COMMISSION_TERM term,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startDate
    ){

       try{
           School school = schoolService.findById(schoolId);
           subscriptionService.activate(school, term, startDate);
           Subscription subscription = subscriptionRepository.findSubscriptionBySchool(school);
           return ResponseEntity.ok(subscription);
       }catch (Exception e){
           log.error(e.getMessage(), e);
           return ResponseEntity.internalServerError().body("Something wrong happened on our servers");
       }
    }

}
