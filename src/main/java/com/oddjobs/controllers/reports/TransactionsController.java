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

package com.oddjobs.controllers.reports;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.repositories.transactions.PaymentTransactionRepository;
import com.oddjobs.repositories.transactions.TransactionRepository;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.services.transactions.TransactionService;
import com.oddjobs.dtos.responses.TransactionResponseDTO;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.services.pos.POSService;
import com.oddjobs.services.schools.SchoolService;
import com.oddjobs.services.students.StudentService;
import com.oddjobs.services.users.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/transactions")
public class TransactionsController {

    private final TransactionRepository transactionRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final POSService posService;
    private final SchoolService schoolService;
    private final StudentService studentService;
    private final UserService userService;
    private final ContextProvider contextProvider;
    private final TransactionService transactionService;

    @GetMapping("")
    public ResponseEntity<?> getTransactions(
            @RequestParam(name="student", required = false) Long studentId,
            @RequestParam(name="school", required = false) Long schoolId,
            @RequestParam(name="parent", required = false) Long parentId,
            @RequestParam(name="posCenter", required = false)Long posCenterId,
            @RequestParam(name="attendant", required = false)Long attendantId,
            @RequestParam(name="status", required = false) Utils.TRANSACTION_STATUS status,
            @RequestParam(name="type", required = false) Utils.TRANSACTION_TYPE type,
            @RequestParam(name="lowerDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date lowerDate,
            @RequestParam(name="upperDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date upperDate,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            @RequestParam(name="format", required = false) String format
    ){
        try{
            List<Date> toDayDates = Utils.todayDates(null);
            ListResponseDTO<TransactionResponseDTO> response;
            Page<? extends Transaction> transactions;
            if(lowerDate == null || upperDate == null){ // if one is null we set all
                lowerDate = toDayDates.get(0);
                upperDate = toDayDates.get(1);
            }
            // get user
            User user = contextProvider.getPrincipal();
            if (user instanceof SchoolUser){
                schoolId =  ((SchoolUser) user).getSchool().getId(); // set this by default if school user making the request
            }
            if (user instanceof  ParentUser && studentId == null){
                parentId = user.getId();
            }
            if(format != null){
                size = Integer.MAX_VALUE;
            }
            Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
            if (schoolId != null){
                // this enables schools just see their staff
                School school = schoolService.findById(schoolId);
                if (attendantId != null){
                    POSAttendant attendant =  posService.findAttendantById(attendantId);
                    transactions = paymentTransactionRepository.findPaymentTransactionsByAttendantAndSchoolAndCreatedAtBetween(attendant, school,lowerDate, upperDate, pageable);
                } else if (posCenterId != null) {
                    PosCenterEntity posCenter =  posService.findById(posCenterId);
                    transactions = paymentTransactionRepository.findPaymentTransactionsByAttendant_PosCenterAndSchoolAndCreatedAtBetween(posCenter, school,lowerDate, upperDate, pageable);
                } else{
                    transactions = transactionRepository.findTransactionsBySchoolAndTransactionTypeAndCreatedAtBetween(school,type,lowerDate,upperDate,pageable);
                }
            }else if(studentId != null){
                StudentEntity student = studentService.findById(studentId);
                if (type == Utils.TRANSACTION_TYPE.COLLECTION){
                    transactions = transactionRepository.findCollectionTransactionsByReceiver(student, pageable);
                }else {
                    transactions = paymentTransactionRepository.findPaymentTransactionsByDebitAccount(student.getWalletAccount(), pageable);
                }

            }else if(parentId != null){
                ParentUser parent = (ParentUser) userService.findById(parentId);
                Calendar calendar = Calendar.getInstance();
                calendar.set(2023, Calendar.JANUARY, 1);
                lowerDate =calendar.getTime();
                transactions = transactionRepository.findTransactionsBySenderAndDateBetween(parent,lowerDate,upperDate,pageable);
            }else if(status != null && type != null){
                transactions = transactionRepository.findTransactionsByStatusAndTransactionTypeAndCreatedAtBetween(status,type,lowerDate, upperDate, pageable);
            }else if(status != null){
                transactions = transactionRepository.findTransactionsByStatusAndCreatedAtBetween(status,lowerDate, upperDate,pageable);
            }else if(type != null){
                transactions = transactionRepository.findTransactionsByTransactionTypeAndCreatedAtBetween(type,lowerDate, upperDate, pageable);
            }
            else if(posCenterId != null){
                PosCenterEntity posCenter =  posService.findById(posCenterId);
                transactions =  paymentTransactionRepository.findPaymentTransactionsByAttendant_PosCenterAndCreatedAtBetween(posCenter,lowerDate, upperDate, pageable);
            } else if (attendantId != null) {
                POSAttendant attendant =  posService.findAttendantById(attendantId);
                transactions =  paymentTransactionRepository.findPaymentTransactionsByAttendantAndCreatedAtBetween(attendant, lowerDate, upperDate, pageable);
            } else{
                transactions = transactionRepository.findAllByCreatedAtBetween(lowerDate, upperDate,pageable);
            }
            List<TransactionResponseDTO> dtos = transactions.getContent().stream().map(TransactionResponseDTO::new).toList();
            if(format != null){
                String t =  type !=null ? type.toString():null;
                byte[] excelContent = transactionService.writeRecordsToExcel(dtos, t);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDispositionFormData("attachment", "transactions.xlsx");
                return ResponseEntity.ok()
                        .headers(headers)
                        .body(excelContent);
            }
            response =  new ListResponseDTO<>(dtos, transactions.getTotalPages());
            response.setLimit(size);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }


    @GetMapping("/{student}")
    public ResponseEntity<?> getStudentTransactions(
            @PathVariable(name="student", required = false) Long studentId,
            @RequestParam(name="type", required = false) Utils.TRANSACTION_TYPE type,@RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            @RequestParam(name="format", required = false) String format
    ){
        try{
            ListResponseDTO<TransactionResponseDTO> response;
            Page<? extends Transaction> transactions;
            if(format != null){
                size = Integer.MAX_VALUE;
            }
            Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
            StudentEntity student = studentService.findById(studentId);
            if (type == Utils.TRANSACTION_TYPE.COLLECTION){
                transactions = transactionRepository.findCollectionTransactionsByReceiver(student, pageable);
            }else {
                transactions = paymentTransactionRepository.findPaymentTransactionsByDebitAccount(student.getWalletAccount(), pageable);
            }
            List<TransactionResponseDTO> dtos = transactions.getContent().stream().map(TransactionResponseDTO::new).toList();
            if(format != null){
                String t =  type !=null ? type.toString():null;
                byte[] excelContent = transactionService.writeRecordsToExcel(dtos, t);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDispositionFormData("attachment", "transactions.xlsx");
                return ResponseEntity.ok()
                        .headers(headers)
                        .body(excelContent);
            }
            response =  new ListResponseDTO<>(dtos, transactions.getTotalPages());
            response.setLimit(size);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
