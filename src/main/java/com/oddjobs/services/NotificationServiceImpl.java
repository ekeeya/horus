package com.oddjobs.services;

import com.oddjobs.repositories.NotificationRepository;
import com.oddjobs.repositories.WithdrawRequestRepository;
import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.entities.approvals.ParentApprovalRequest;
import com.oddjobs.entities.approvals.SchoolApprovalRequest;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.repositories.school.ParentApprovalRequestRepository;
import com.oddjobs.repositories.school.SchoolApprovalRequestRepository;
import com.oddjobs.repositories.users.UserRepository;
import com.oddjobs.repositories.wallet.CardProvisionRequestRepository;
import com.oddjobs.entities.CardProvisionRequest;
import com.oddjobs.entities.Notification;
import com.oddjobs.entities.School;
import com.oddjobs.utils.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService{

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    final SchoolApprovalRequestRepository schoolApprovalRequestRepository;
    final ParentApprovalRequestRepository parentApprovalRequestRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final CardProvisionRequestRepository cardProvisionRequestRepository;


    protected List<String> getSystemUserEmails(){
        List<String> emails = new ArrayList<>();
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("id").descending());
        List<User> systemUsers =  userRepository.findByAccountType(Utils.ACCOUNT_TYPE.ADMIN, pageable).getContent();
        for (User user: systemUsers){
            if(user.getEmail() != null){
                emails.add(user.getEmail());
            }
        }
        return emails;
    }

    protected List<String> getSchoolUserEmails(School school){
        List<String> emails =  new ArrayList<>();
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("id").descending());
        List<SchoolUser> users = (List<SchoolUser>) userRepository.findUsersBySchool(school,pageable).getContent();
        for (SchoolUser u: users){
            if(u.getEmail() != null){
                emails.add(u.getEmail());
            }
        }
        return emails;
    }
    @Override
    public void createNotification(Notification.Type type, Long entityId, Notification.Action action, String message) {

        Notification   notification =  new Notification();
        notification.setType(type);
        notification.setMessage(message);
        notification.setEntityId(entityId);
        //TODO send email to involved parties we can use type and entityId to track who to notify
        notificationRepository.save(notification);
    }

    @Override
    public void markSeen(Long id) {
        Notification notification = notificationRepository.findById(id).get();
        notification.setSeen(true);
        notificationRepository.save(notification);
    }

    @Override
    public List<String> returnEmailAddresses(Notification notification) {
        List<String> emails = new ArrayList<>();
        try{
            switch (notification.getType()){
                case WITHDRAW_REQUEST -> {
                    WithdrawRequest r =  withdrawRequestRepository.findById(notification.getEntityId()).get();
                    School school =  r.getSchool();
                    emails.addAll(getSchoolUserEmails(school));
                    emails.addAll(getSystemUserEmails());
                }
                case PRIMARY_PARENT_APPROVAL_REQUEST -> {
                    SchoolApprovalRequest request = schoolApprovalRequestRepository.findById(notification.getEntityId()).get();
                    School school = request.getStudent().getSchool();
                    ParentUser parent = request.getPrimaryParent();
                    emails.add(parent.getEmail());
                    emails.addAll(getSchoolUserEmails(school));
                }
                case SECONDARY_PARENT_APPROVAL_REQUEST -> {
                    ParentApprovalRequest request = parentApprovalRequestRepository.findById(notification.getEntityId()).get();
                    ParentUser primaryParent = request.getPrimaryParent();
                    ParentUser secondaryParent = request.getSecondaryParent();
                    emails.add(primaryParent.getEmail());
                    emails.add(secondaryParent.getEmail());
                }
                case CARD_PROVISIONING_REQUEST -> {
                    CardProvisionRequest request = cardProvisionRequestRepository.findById(notification.getEntityId()).get();
                    School school = request.getStudent().getSchool();
                    // school and parent
                    ParentUser parent = request.getStudent().getPrimaryParent();
                    emails.add(parent.getEmail());
                    emails.addAll(getSchoolUserEmails(school));
                }
                default -> {
                    //
                }
            }
            return emails;
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return null;
        }
    }
}
