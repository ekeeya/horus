package com.oddjobs.repositories;

import com.oddjobs.entities.School;
import com.oddjobs.entities.WithdrawRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WithdrawRequestRepository extends JpaRepository<WithdrawRequest, Long> {

    WithdrawRequest findByReferenceNo(String referenceNo);
    Page<WithdrawRequest> findWithdrawRequestsBySchool(School school, Pageable pageable);
    Page<WithdrawRequest> findWithdrawRequestsBySchoolAndStatus(School school,WithdrawRequest.Status status, Pageable pageable);
    Page<WithdrawRequest> findWithdrawRequestsByStatus(WithdrawRequest.Status status, Pageable pageable);

    Page<WithdrawRequest> findWithdrawRequestsByStatusIn(List<WithdrawRequest.Status> statuses, Pageable pageable);
    long countBySchoolAndStatus(School school, WithdrawRequest.Status status);
}
