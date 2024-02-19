package com.oddjobs.repositories.wallet;

import com.oddjobs.entities.CardProvisionRequest;
import com.oddjobs.entities.School;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardProvisionRequestRepository extends JpaRepository<CardProvisionRequest, Long> {

    Page<CardProvisionRequest> findCardProvisionRequestsByProvisionedIs(boolean provisioned, Pageable pageable);
    Page<CardProvisionRequest> findCardProvisionRequestsByStudent_WalletAccount_CardNoLike(String cardNo, Pageable pageable);
    CardProvisionRequest findCardProvisionRequestsByStudent_WalletAccount_CardNo(String cardNo);
    Page<CardProvisionRequest> findCardProvisionRequestsByStudent_SchoolAndProvisionedIs(School school, boolean provisioned, Pageable pageable);

    long countCardProvisionRequestsByProvisionedIs(boolean provisioned);
}
