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

package com.oddjobs.controllers;


import com.oddjobs.components.ContextProvider;
import com.oddjobs.entities.approvals.ApprovalRequest;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.SchoolWithdrawAccount;
import com.oddjobs.repositories.school.SchoolApprovalRequestRepository;
import com.oddjobs.repositories.transactions.PaymentTransactionRepository;
import com.oddjobs.repositories.wallet.CardProvisionRequestRepository;
import com.oddjobs.repositories.wallet.SchoolWithdrawAccountRepository;
import com.oddjobs.repositories.wallet.StudentWalletAccountRepository;
import com.oddjobs.services.transactions.TransactionService;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.School;
import com.oddjobs.services.pos.POSService;
import com.oddjobs.services.schools.SchoolService;
import com.oddjobs.services.wallet.WalletService;
import com.oddjobs.utils.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final SchoolWithdrawAccountRepository schoolWithdrawAccountRepository;

    private final ContextProvider contextProvider;
    private final WalletService walletService;
    private final TransactionService transactionService;
    private final SchoolService schoolService;
    private final StudentWalletAccountRepository studentWalletAccountRepository;
    private final SchoolApprovalRequestRepository schoolApprovalRequestRepository;
    private final POSService posService;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final CardProvisionRequestRepository cardProvisionRequestRepository;

    @GetMapping("statistics")
    @Secured({"ROLE_ADMIN", "ROLE_SCHOOL"})
    public ResponseEntity<?> getDashboard(){
        Map<String, Object> statistics =  new HashMap<>();
        double balance;
        double totalPayments;
        double totalCollections;
        double totalWithDraws;
        Map<String, Object> wallets = new HashMap<>();
        User user =  contextProvider.getPrincipal();
        if (user instanceof SchoolUser){
            School school = ((SchoolUser) user).getSchool();
            AccountEntity account =  walletService.findWalletBySchool(school);
             balance =  account.getBalance().doubleValue();
             totalPayments = transactionService.totalTransactionsByTypeAndSchoolAndStatus(Utils.TRANSACTION_TYPE.PAYMENT,school, Utils.TRANSACTION_STATUS.SUCCESS);
             totalCollections =  transactionService.totalTransactionsByTypeAndSchoolAndStatus(Utils.TRANSACTION_TYPE.COLLECTION, school, Utils.TRANSACTION_STATUS.SUCCESS);
             SchoolWithdrawAccount withdrawAccount =  schoolWithdrawAccountRepository.findSchoolWalletAccountBySchool(school);
             totalWithDraws =  withdrawAccount.getBalance().doubleValue();
             wallets.put("total", studentWalletAccountRepository.countAllByStudent_School(school));
             wallets.put("pending", studentWalletAccountRepository.countAllByStudent_SchoolAndStatus(school, Utils.WALLET_STATUS.PENDING));
             wallets.put("suspended", studentWalletAccountRepository.countAllByStudent_SchoolAndStatus(school, Utils.WALLET_STATUS.SUSPENDED));
             wallets.put("active", studentWalletAccountRepository.countAllByStudent_SchoolAndStatus(school, Utils.WALLET_STATUS.ACTIVE));
             wallets.put("disabled", studentWalletAccountRepository.countAllByStudent_SchoolAndStatus(school, Utils.WALLET_STATUS.DISABLED));
        }else{
            AccountEntity account = walletService.findCollectionAccount();
            balance =  account.getBalance().doubleValue();
            totalPayments=transactionService.totalTransactionsByTypeAndStatus(Utils.TRANSACTION_TYPE.PAYMENT, Utils.TRANSACTION_STATUS.SUCCESS);
            totalCollections = transactionService.totalTransactionsByTypeAndStatus(Utils.TRANSACTION_TYPE.COLLECTION, Utils.TRANSACTION_STATUS.SUCCESS);
            totalWithDraws = transactionService.totalTransactionsByTypeAndStatus(Utils.TRANSACTION_TYPE.DISBURSEMENT, Utils.TRANSACTION_STATUS.SUCCESS);
            statistics.put("schools", schoolService.countSchools());
            wallets.put("total", studentWalletAccountRepository.count());
            wallets.put("pending", studentWalletAccountRepository.countAllByStatus(Utils.WALLET_STATUS.PENDING));
            wallets.put("suspended", studentWalletAccountRepository.countAllByStatus(Utils.WALLET_STATUS.SUSPENDED));
            wallets.put("active", studentWalletAccountRepository.countAllByStatus(Utils.WALLET_STATUS.ACTIVE));
            wallets.put("disabled", studentWalletAccountRepository.countAllByStatus(Utils.WALLET_STATUS.DISABLED));
        }
        statistics.put("balance", balance);
        statistics.put("totalPayments", totalPayments);
        statistics.put("totalCollections",totalCollections);
        statistics.put("totalWithDraws", totalWithDraws);
        statistics.put("students", wallets);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("link-requests-summary")
    @Secured({"ROLE_SCHOOL"})
    public ResponseEntity<?> getLinkRequestSummary(){

        try{
            SchoolUser user = (SchoolUser) contextProvider.getPrincipal();
            School school =  user.getSchool();
            Map<String, Object> results = new HashMap<>();
            results.put("pending", schoolApprovalRequestRepository.countAllByStudent_SchoolAndStatus(school, ApprovalRequest.Status.PENDING));
            results.put("approved", schoolApprovalRequestRepository.countAllByStudent_SchoolAndStatus(school, ApprovalRequest.Status.APPROVED));
            results.put("rejected", schoolApprovalRequestRepository.countAllByStudent_SchoolAndStatus(school, ApprovalRequest.Status.REJECTED));
            return ResponseEntity.ok(results);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("pos-sales-summary")
    @Secured({"ROLE_SCHOOL"})
    public ResponseEntity<?> getPosSalesSummary() {
        try{
            SchoolUser user = (SchoolUser) contextProvider.getPrincipal();
            School school =  user.getSchool();
            List<Object> results = new ArrayList<>();
            List<PosCenterEntity> posCenters = posService.getPosCentersbySchool(school.getId());
            Date now = Calendar.getInstance().getTime();
            for (PosCenterEntity pos:posCenters ) {
                Map<String, Object> record = new HashMap<>();
                List<Double> sales = new ArrayList<>();
                List<String> days = new ArrayList<>();
                record.put("name", pos.getName());
                record.put("attendants", pos.getAttendants().size());
                for (int i =0; i<7;i++){
                    Date date = Utils.getPastDate(now,i+1);
                    List<Date> dates = Utils.todayDates(date);
                    days.add(Utils.toShortDate(dates.get(0)));
                    Double s = paymentTransactionRepository.sumPaymentsByPosAndStatusAndDate(pos, Utils.TRANSACTION_STATUS.SUCCESS, dates.get(0), dates.get(1));
                    sales.add(s);
                }
                record.put("sales",sales);
                record.put("days", days);
                results.add(record);
            }
            return ResponseEntity.ok(results);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("school-sales-summary")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> getSchoolSalesSummary() {
        try{

            List<School> schools = schoolService.fetchAll(0, Integer.MAX_VALUE).getContent();
            List<Object> results = new ArrayList<>();
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            Date now = calendar.getTime();
            for (School school:schools ) {
                Map<String, Object> record = new HashMap<>();
                List<Double> sales = new ArrayList<>();
                List<String> days = new ArrayList<>();
                record.put("name", school.getAlias() !=null ? school.getAlias() : school.getName());
                for (int i =0; i<7;i++){
                    Date date = Utils.getPastDate(now,i+1);
                    List<Date> dates = Utils.todayDates(date);
                    days.add(Utils.toShortDate(dates.get(0)));
                    Double s = paymentTransactionRepository.sumPaymentsBySchoolAndStatusAndDate(school, Utils.TRANSACTION_STATUS.SUCCESS, dates.get(0), dates.get(1));
                    sales.add(s);
                }
                record.put("sales",sales);
                record.put("days", days);
                results.add(record);
            }
            return ResponseEntity.ok(results);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("provision-requests-summary")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> getCardProvisioningRequestSummary(){
        try{
            Map<String, Object> results = new HashMap<>();
            results.put("pending", cardProvisionRequestRepository.countCardProvisionRequestsByProvisionedIs(false));
            results.put("provisioned", cardProvisionRequestRepository.countCardProvisionRequestsByProvisionedIs(true));
            return ResponseEntity.ok(results);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return  ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
