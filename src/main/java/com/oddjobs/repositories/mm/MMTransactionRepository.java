package com.oddjobs.repositories.mm;

import com.oddjobs.entities.transactions.mm.MMTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface MMTransactionRepository extends JpaRepository<MMTransaction, Long> {

    @Query("SELECT t FROM MMTransaction t WHERE (TYPE(t) = EasyPayTransaction OR TYPE(t) = FlutterWaveTransaction) AND t.reference = :reference")
    <T extends MMTransaction> T findMMTransactionByRef(@Param("reference") String reference);

    @Query("SELECT t FROM MMTransaction t WHERE TYPE(t) = MTNTransaction AND t.xReferenceId = :xReferenceId")
    <T extends MMTransaction> T findMMTransactionByXreferenceId(@Param("xReferenceId") String xReferenceId);

    <T extends MMTransaction> T findMMTransactionByTransactionId(String transactionId);
}
