package com.oddjobs.repositories.school;

import com.oddjobs.entities.School;
import com.oddjobs.entities.approvals.ApprovalRequest;
import com.oddjobs.entities.approvals.SchoolApprovalRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolApprovalRequestRepository extends JpaRepository<SchoolApprovalRequest, Long> {
    Page<SchoolApprovalRequest> findApprovalRequestsByStudent_SchoolAndStatus(School school, ApprovalRequest.Status status, Pageable pageable);
    long countAllByStudent_SchoolAndStatus(School school, ApprovalRequest.Status status);
}
