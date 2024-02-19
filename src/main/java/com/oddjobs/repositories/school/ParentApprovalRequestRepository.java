package com.oddjobs.repositories.school;

import com.oddjobs.entities.approvals.ApprovalRequest;
import com.oddjobs.entities.approvals.ParentApprovalRequest;
import com.oddjobs.entities.users.ParentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentApprovalRequestRepository extends JpaRepository<ParentApprovalRequest, Long> {

    Page<ParentApprovalRequest> findApprovalRequestsByPrimaryParentAndStatus(ParentUser parentUser, ApprovalRequest.Status status, Pageable pageable);
}
