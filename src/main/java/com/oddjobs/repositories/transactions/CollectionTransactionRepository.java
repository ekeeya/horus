package com.oddjobs.repositories.transactions;

import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.transactions.CollectionTransaction;
import com.oddjobs.entities.users.User;
import com.oddjobs.utils.Utils;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CollectionTransactionRepository  extends JpaRepository<CollectionTransaction, Long> {

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM CollectionTransaction p WHERE p.receiver=:receiver AND p.status = :status")
    Double sumCollectionsByStudentAndStatus(
            @Param("receiver") StudentEntity receiver,
            @Param("status") Utils.TRANSACTION_STATUS status
    );

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM CollectionTransaction p WHERE p.sender=:sender AND p.status = :status")
    Double sumCollectionsByParentAndStatus(
            @Param("sender") User sender,
            @Param("status") Utils.TRANSACTION_STATUS status
    );
}
