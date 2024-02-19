package com.oddjobs.repositories.school;
import com.oddjobs.entities.approvals.ApprovalRequest;
import com.oddjobs.entities.users.ParentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, Long> {
    Page<? extends ApprovalRequest> findApprovalRequestsByMadeByAndStatus(ParentUser user, ApprovalRequest.Status status, Pageable pageable);
    Page<ApprovalRequest> findAllByStatus(ApprovalRequest.Status status, Pageable pageable);
}
