package com.oddjobs.services.schools;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.requests.ApprovalRequestCreateDTO;
import com.oddjobs.dtos.requests.ApprovalRequestDTO;
import com.oddjobs.entities.Notification;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.exceptions.UserNotFoundException;
import com.oddjobs.repositories.school.ApprovalRequestRepository;
import com.oddjobs.repositories.school.ParentApprovalRequestRepository;
import com.oddjobs.repositories.school.SchoolApprovalRequestRepository;
import com.oddjobs.repositories.school.SchoolRepository;
import com.oddjobs.repositories.students.StudentRepository;
import com.oddjobs.repositories.users.UserRepository;
import com.oddjobs.repositories.wallet.WalletAccountRepository;
import com.oddjobs.services.NotificationService;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.approvals.ApprovalRequest;
import com.oddjobs.entities.approvals.ParentApprovalRequest;
import com.oddjobs.entities.approvals.SchoolApprovalRequest;
import com.oddjobs.entities.users.AdminUser;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.services.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;


@Service
@RequiredArgsConstructor
@Slf4j
public class ApprovalRequestServiceImpl implements ApprovalRequestService{
    final WalletService walletService;
    final WalletAccountRepository walletRepository;
    final ApprovalRequestRepository approvalRequestRepository;
    final SchoolApprovalRequestRepository schoolApprovalRequestRepository;
    final ParentApprovalRequestRepository parentApprovalRequestRepository;
    final StudentRepository studentRepository;
    final SchoolRepository schoolRepository;
    final UserRepository userRepository;
    private final ContextProvider contextProvider;
    private final NotificationService notificationService;

    protected boolean allowedRequest(ApprovalRequest r){
        User user = contextProvider.getPrincipal();
        if(!r.getStatus().equals(ApprovalRequest.Status.PENDING)){
            return false;
        }

        if (user instanceof AdminUser){
            return  true;
        }
        if (r.getType().equals(Utils.APPROVAL_TYPES.PARENT_APPROVAL)){
            return user.getId().equals(r.getPrimaryParent().getId());
        }else{
            return  ((SchoolUser) user).getSchool().getId().equals(r.getStudent().getSchool().getId());
        }
    }

    protected void approveRejectRequest(ApprovalRequest r, boolean approve) throws Exception {
        if (r.getType().equals(Utils.APPROVAL_TYPES.SCHOOL_APPROVAL)){
            approvePrimaryParent((SchoolApprovalRequest) r,approve, false);
        }else{
            approveSecondaryParent((ParentApprovalRequest) r, approve);
        }
    }
    @Override
    public void approvePrimaryParent(SchoolApprovalRequest request, boolean approve, boolean force) throws Exception {
        // approve the request
        String msg;
        User u =  contextProvider.getPrincipal();
        String fullName = u != null  ? u.fullName():"SYSTEM";
        if(force || allowedRequest(request)){
            request.setIsApproved(approve);
            Notification.Action action;
            if(approve){
                request.setStatus(ApprovalRequest.Status.APPROVED);
                StudentEntity student =  request.getStudent();
                ParentUser parentUser = request.getPrimaryParent();
                // set them as primary parent.
                student.setPrimaryParent(parentUser);
                // add parent to student parents list
                List<ParentUser > parents =  student.getParents();
                parents =  parents !=null?parents: new ArrayList<>();
                parents.add(parentUser);
                student.setParents(parents);
                student.setEnabled(true);
                studentRepository.save(student);
                StudentWalletAccount wallet = student.getWalletAccount();
                wallet.setStatus(Utils.WALLET_STATUS.ACTIVE);
                walletRepository.save(wallet);
                // create card provision request
                walletService.createCardProvisioningRequest(student);
                // this is our parent no doubt so set them
                if(u instanceof SchoolUser){ // just in case but we are sure this is a school user
                    parentUser.setSchool(((SchoolUser) u).getSchool());
                    userRepository.save(parentUser); // we can do better because multiple schools can have the same parent as primary to one of their kids
                }
                action = Notification.Action.Approve;
                msg = String.format("You have been APPROVED by %s on behalf of %s to contribute to wallet card of student %s (%s)",fullName, request.getStudent().getSchool().getName(), request.getStudent().fullName(), request.getStudent().getClassRoom().getName());
            }else{
                action = Notification.Action.Reject;
                request.setStatus(ApprovalRequest.Status.REJECTED);
                msg = String.format("You have been REJECTED by %s on behalf of %s from contributing to wallet card of student %s (%s)",fullName, request.getStudent().getSchool().getName(), request.getStudent().fullName(), request.getStudent().getClassRoom().getName());
            }
            approvalRequestRepository.save(request);
            notificationService.createNotification(Notification.Type.PRIMARY_PARENT_APPROVAL_REQUEST,request.getId(), action,msg);
        }
        else{
            throw  new Exception("User not allowed to approve this request");
        }

    }

    @Override
    public void approveSecondaryParent(ParentApprovalRequest request,boolean approve) throws Exception {
        String msg;
        if(allowedRequest(request)){
            Notification.Action action;
            request.setIsApproved(approve);
            if(approve){
                request.setStatus(ApprovalRequest.Status.APPROVED);
                // add parent to student parents list
                StudentEntity student =  request.getStudent();
                List<ParentUser > parents =  student.getParents(); // this can't be null at this point (we have a primary parent)
                parents.add(request.getSecondaryParent());
                student.setParents(parents);
                studentRepository.save(student);  // persist them
                action = Notification.Action.Approve;
                msg = String.format("You have been APPROVED by primary parent %s to contribute to student %s (%s) %s",request.getPrimaryParent().fullName(), request.getStudent().fullName(), request.getStudent().getClassRoom().getName(), request.getStudent().getSchool().getName());
            }
            else{
                action = Notification.Action.Reject;
                msg = String.format("You have been REJECTED by primary parent %s from contributing to student %s (%s) %s",request.getPrimaryParent().fullName(), request.getStudent().fullName(), request.getStudent().getClassRoom().getName(), request.getStudent().getSchool().getName());
                request.setStatus(ApprovalRequest.Status.REJECTED);
            }
            approvalRequestRepository.save(request);
            notificationService.createNotification(Notification.Type.SECONDARY_PARENT_APPROVAL_REQUEST,request.getId(),action,msg);
        }else{
            throw  new Exception("User not allowed to approve this request");
        }
    }

    @Override
    public List<ApprovalRequest> approveParentStudentLinkRequest(ApprovalRequestDTO requestDTO) throws Exception {
        List<ApprovalRequest> approvals = new ArrayList<>();
        List<Long> requestIds = requestDTO.getRequestIds() !=null ? requestDTO.getRequestIds(): new ArrayList<>();
        if (requestDTO.getRequestId() !=null){
            requestIds.add(requestDTO.getRequestId());
            requestDTO.setRequestIds(requestIds);
        }
        if(requestDTO.getRequestIds() != null && requestDTO.getRequestIds().size() > 0){
            for(Long r: requestDTO.getRequestIds()){
                ApprovalRequest request =  approvalRequestRepository.findById(r).get();
                approveRejectRequest(request, requestDTO.isApprove());
                approvals.add(request);
            }
        }else{
            log.warn("Missing requestId, or requestIDs params in the request body");
            throw  new Exception("Bad Request");
        }
        return  approvals;
    }

    @Override
    public ApprovalRequest createApprovalRequest(ApprovalRequestCreateDTO data, boolean fromBulk) throws Exception {
        ApprovalRequest request;
        ParentUser primaryParent = (ParentUser) userRepository.findUserById(data.getParent());
        StudentEntity student = studentRepository.findById(data.getStudentId()).get();
        if(data.getType().equals(Utils.APPROVAL_TYPES.SCHOOL_APPROVAL)){
            if (student.getPrimaryParent() !=null  && !fromBulk){
                throw new Exception(String.format("Student %s already has a primary parent %s", student, student.getPrimaryParent().getUsername()));
            }
            request = new SchoolApprovalRequest();
            request.setType(Utils.APPROVAL_TYPES.SCHOOL_APPROVAL);
            request.setMadeBy(primaryParent);
        }else{
            request =  new ParentApprovalRequest();
            request.setType(Utils.APPROVAL_TYPES.PARENT_APPROVAL);
            ParentUser secondaryParent = (ParentUser) userRepository.findUserById(data.getSecondaryParentId());
            if (student.getParents() != null && student.getParents().contains(secondaryParent)){
                throw new Exception((String.format("Parent %s is already among contributors for student %s", secondaryParent.getUsername(), student)));
            }
            ((ParentApprovalRequest) request).setSecondaryParent(secondaryParent);
            request.setMadeBy(secondaryParent);
        }
        request.setPrimaryParent(primaryParent);
        request.setStudent(student);
        request = approvalRequestRepository.save(request);
        String msg = String.format("A request to approve parent %s to contribute to student's wallet for %s's from school %s has been created.", request.getMadeBy().fullName(),request.getStudent().getSchool(), request.getStudent().getSchool().getName());
        notificationService.createNotification(data.getType().equals(Utils.APPROVAL_TYPES.SCHOOL_APPROVAL)? Notification.Type.PRIMARY_PARENT_APPROVAL_REQUEST : Notification.Type.SECONDARY_PARENT_APPROVAL_REQUEST, request.getId(), Notification.Action.Approve,msg);
        return request;
    }

    @Override
    public Page<SchoolApprovalRequest> findPrimaryParentApprovalRequestsBySchool(Long schoolId,ApprovalRequest.Status status, int offset, int limit) throws SchoolNotFoundException {
        Pageable pageable =  PageRequest.of(offset, limit, Sort.by("id").descending());
        try{
            School school =  schoolRepository.findById(schoolId).get(); //
            return schoolApprovalRequestRepository.findApprovalRequestsByStudent_SchoolAndStatus(school, status, pageable);
        }catch (NoSuchElementException e){
            throw new SchoolNotFoundException(schoolId);
        }
    }

    @Override
    public Page<ParentApprovalRequest> findSecondaryParentApprovalRequestsByParent(Long parentId, ApprovalRequest.Status status, int offset, int limit) throws UserNotFoundException {
        Pageable pageable =  PageRequest.of(offset, limit, Sort.by("id").descending());
        ParentUser parentUser = (ParentUser) userRepository.findUserById(parentId);
        if (parentUser != null){
            return  parentApprovalRequestRepository.findApprovalRequestsByPrimaryParentAndStatus(parentUser, status, pageable);
        }
        throw new UserNotFoundException(parentId);
    }

    @Override
    public Page<? extends ApprovalRequest> findMyRequests(Long parentId, ApprovalRequest.Status status, int page, int size) throws UserNotFoundException {
        ParentUser parentUser = (ParentUser) userRepository.findUserById(parentId);
        if (parentUser != null){
            Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
            return approvalRequestRepository.findApprovalRequestsByMadeByAndStatus(parentUser,status, pageable);
        }
        throw new UserNotFoundException(parentId);
    }

    @Override
    public Page<ApprovalRequest> findAll(int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return approvalRequestRepository.findAll(pageable);
    }

    @Override
    public Page<ApprovalRequest> findByStatus(ApprovalRequest.Status status, int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return approvalRequestRepository.findAllByStatus(status,pageable);
    }
}
