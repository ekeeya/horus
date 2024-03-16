package com.oddjobs.services.schools;

import com.oddjobs.dtos.requests.ApprovalRequestCreateDTO;
import com.oddjobs.dtos.requests.ApprovalRequestDTO;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.exceptions.UserNotFoundException;
import com.oddjobs.entities.approvals.ApprovalRequest;
import com.oddjobs.entities.approvals.ParentApprovalRequest;
import com.oddjobs.entities.approvals.SchoolApprovalRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ApprovalRequestService {

    void approvePrimaryParent(SchoolApprovalRequest request, boolean approve, boolean force, boolean fromBulk) throws Exception;

    void approveSecondaryParent(ParentApprovalRequest request, boolean approve) throws Exception;

    List<ApprovalRequest> approveParentStudentLinkRequest(ApprovalRequestDTO requestDTO) throws Exception;

    ApprovalRequest createApprovalRequest(ApprovalRequestCreateDTO data, boolean fromBulk) throws Exception;

    Page<SchoolApprovalRequest> findPrimaryParentApprovalRequestsBySchool(Long schoolId, ApprovalRequest.Status status, int page, int size) throws SchoolNotFoundException;
    Page<ParentApprovalRequest> findSecondaryParentApprovalRequestsByParent(Long parentId, ApprovalRequest.Status status, int page, int size) throws UserNotFoundException;
    Page<? extends ApprovalRequest> findMyRequests(Long parentId,ApprovalRequest.Status status, int page, int size) throws UserNotFoundException;
    Page<ApprovalRequest> findAll(int page, int size);
    Page<ApprovalRequest> findByStatus(ApprovalRequest.Status status, int page, int size);
}
