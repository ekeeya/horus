package com.oddjobs.repositories.transactions;

import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.users.ParentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE TYPE(t) = CollectionTransaction AND t.mmTransaction = :mmTransaction")
     <T extends Transaction> T findByMMTransaction(@Param("mmTransaction") MMTransaction mmTransaction);

    Transaction findTransactionByTransactionId(String transactionId);

    @Transactional
    @Modifying
    @Query(value = "UPDATE transaction SET status = :status WHERE id = :id", nativeQuery = true)
    void updateTransactionStatus(
            @Param("status") String status,
            @Param("id") Long id);

    Page<Transaction> findTransactionsByTransactionType(Utils.TRANSACTION_TYPE transactionType, Pageable pageable);

    Page<Transaction> findTransactionsByStatus(Utils.TRANSACTION_STATUS status, Pageable pageable);


    Page<Transaction> findTransactionsByTransactionTypeAndCreatedAtBetween(Utils.TRANSACTION_TYPE transactionType, Date lowerDate, Date upperDate, Pageable pageable);

    Page<Transaction> findTransactionsByStatusAndCreatedAtBetween(Utils.TRANSACTION_STATUS status, Date lowerDate, Date upperDate, Pageable pageable);

    Page<Transaction> findTransactionsByStatusAndTransactionTypeAndCreatedAtBetween(Utils.TRANSACTION_STATUS status, Utils.TRANSACTION_TYPE type, Date lowerDate, Date upperDate, Pageable pageable);

    Page<Transaction> findAllByCreatedAtBetween(Date lowerDate, Date upperDate, Pageable pageable);

    Page<Transaction> findTransactionsBySchoolAndTransactionTypeAndCreatedAtBetween(School school, Utils.TRANSACTION_TYPE type, Date lowerDate, Date upperDate, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE TYPE(t) = CollectionTransaction AND t.receiver = :student AND(t.transactionType=:type)")
    Page<Transaction> findTransactionsByReceiver(
            @Param("student") StudentEntity student,
            @Param("type") Utils.TRANSACTION_TYPE type,
            Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE TYPE(t) = CollectionTransaction AND t.sender = :parent AND (t.createdAt >=:lowerDate AND t.createdAt <=:upperDate)")
    Page<Transaction> findTransactionsBySenderAndDateBetween(
            @Param("parent") ParentUser parent,
            @Param("lowerDate")Date lowerDate,
            @Param("upperDate")Date upperDate,
            Pageable pageable);

    @Query("SELECT COALESCE(SUM(amount), 0) FROM Transaction  WHERE transactionType =:type AND status = :status")
    Double sumByTransactionTypeAndStatus(
            @Param("type") Utils.TRANSACTION_TYPE type,
            @Param("status")Utils.TRANSACTION_STATUS status
    );

    @Query("SELECT COALESCE(SUM(amount), 0) FROM Transaction WHERE school=:school AND transactionType =:type AND status = :status")
    Double sumByTransactionTypeAndSchoolAndStatus(
            @Param("type") Utils.TRANSACTION_TYPE type,
            @Param("school")School school,
            @Param("status")Utils.TRANSACTION_STATUS status
    );
}
