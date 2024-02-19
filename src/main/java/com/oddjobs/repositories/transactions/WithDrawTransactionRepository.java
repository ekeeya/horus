package com.oddjobs.repositories.transactions;

import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.entities.transactions.WithDrawTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WithDrawTransactionRepository extends JpaRepository<WithDrawTransaction, Long> {

    WithDrawTransaction findWithDrawTransactionByRequest(WithdrawRequest request);
}
