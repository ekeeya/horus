package com.oddjobs.repositories.transactions;

import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.School;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    List<PaymentTransaction> findPaymentTransactionsByDebitAccountAndCreatedAtBetween(StudentWalletAccount account, Date lowerDate, Date upperDate);
    Page<PaymentTransaction> findPaymentTransactionsByDebitAccount(StudentWalletAccount account,Pageable pageable);
    Page<PaymentTransaction> findPaymentTransactionsByAttendant_PosCenter(PosCenterEntity posCenter, Pageable pageable);
    Page<PaymentTransaction> findPaymentTransactionsByAttendant_PosCenterAndCreatedAtBetween(PosCenterEntity posCenter, Date lowerDate, Date upperDate, Pageable pageable);
    Page<PaymentTransaction> findPaymentTransactionsByAttendant_PosCenterAndSchool(PosCenterEntity posCenter, School school, Pageable pageable);
    Page<PaymentTransaction> findPaymentTransactionsByAttendant_PosCenterAndSchoolAndCreatedAtBetween(PosCenterEntity posCenter,School school, Date lowerDate, Date upperDate, Pageable pageable);
    Page<PaymentTransaction> findPaymentTransactionsByAttendant(POSAttendant attendant, Pageable pageable);
    Page<PaymentTransaction> findPaymentTransactionsByAttendantAndSchoolAndCreatedAtBetween(POSAttendant attendant, School school,Date lowerDate, Date upperDate, Pageable pageable);
    Page<PaymentTransaction> findPaymentTransactionsByAttendantAndCreatedAtBetween(POSAttendant attendant, Date loweDate, Date upperDate, Pageable pageable);

    long countPaymentTransactionsByAttendant_PosCenterAndCreatedAtBetween(PosCenterEntity pos, Date loweDate, Date upperDate);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentTransaction p WHERE p.attendant.posCenter=:pos AND p.status = :status AND (p.createdAt >=:lowerDate AND p.createdAt <=:upperDate)")
    Double sumPaymentsByPosAndStatusAndDate(
            @Param("pos")PosCenterEntity pos,
            @Param("status") Utils.TRANSACTION_STATUS status,
            @Param("lowerDate")Date lowerDate,
            @Param("upperDate")Date upperDate
    );

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentTransaction p WHERE p.school=:school AND p.status = :status AND (p.createdAt >=:lowerDate AND p.createdAt <=:upperDate)")
    Double sumPaymentsBySchoolAndStatusAndDate(
            @Param("school")School school,
            @Param("status")Utils.TRANSACTION_STATUS status,
            @Param("lowerDate")Date lowerDate,
            @Param("upperDate")Date upperDate
    );

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentTransaction p WHERE p.debitAccount=:debitAccount AND p.status = :status")
    Double sumPaymentsByStudentAndStatus(
            @Param("debitAccount")StudentWalletAccount debitAccount,
            @Param("status")Utils.TRANSACTION_STATUS status
    );
}
