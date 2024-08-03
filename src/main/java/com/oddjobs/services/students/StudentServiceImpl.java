package com.oddjobs.services.students;

import com.oddjobs.dtos.requests.*;
import com.oddjobs.entities.CardEntity;
import com.oddjobs.entities.ClassRoom;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.repositories.school.ClassRoomRepository;
import com.oddjobs.repositories.school.SchoolRepository;
import com.oddjobs.repositories.students.CardRepository;
import com.oddjobs.repositories.students.StudentRepository;
import com.oddjobs.repositories.users.UserRepository;
import com.oddjobs.repositories.wallet.WalletAccountRepository;
import com.oddjobs.services.schools.subscriptions.CommissionService;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.approvals.SchoolApprovalRequest;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.services.schools.ApprovalRequestService;
import com.oddjobs.services.users.UserService;
import com.oddjobs.services.wallet.WalletService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import static com.oddjobs.utils.Utils.ENV.PRODUCTION;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StudentServiceImpl implements StudentService{

    private final StudentRepository studentRepository;
    private final SchoolRepository schoolRepository;
    private final WalletService walletService;
    private final ClassRoomRepository classRoomRepository;
    private final CardRepository cardRepository;
    private final WalletAccountRepository walletAccountRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ApprovalRequestService approvalRequestService;

    private final CommissionService commissionService;

    @Override
    @Transactional
    public StudentEntity registerStudent(StudentRequestDTO request) throws Exception {
        // create student record
        School school;
        try{
           school =  schoolRepository.findById(request.getSchool()).get();
        }catch (NoSuchElementException e){
            throw  new SchoolNotFoundException(request.getSchool());
        }
        StudentEntity student;
        if(request.getId() !=null){
            student =  findById(request.getId());
        }else{
            student =  new StudentEntity();
        }
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setMiddleName(request.getMiddleName());
        student.setSchool(school);
        ClassRoom classRoom =  classRoomRepository.findClassRoomByNameAndSchool(request.getClassName(), school);
        student.setClassRoom(classRoom);
        StudentEntity s = studentRepository.save(student);
        CardEntity card =  new CardEntity();
        if (request.getCardNo() != null){
            card.setCardNo(request.getCardNo());
        }
        card.setStudent(s);
        card = cardRepository.save(card);
        if(request.getId() == null){
            //create wallet account
            StudentWalletAccount account = walletService.createStudentWalletAccount(s);
            s.setWalletAccount(account);
            account.setCard(card);
            account.setCardNo(card.getCardNo());
            account.setBalance(BigDecimal.valueOf(request.getBalance()));
            account.setMaximumDailyLimit(BigDecimal.valueOf(request.getDailyLimit()));
        }

        // attach to parent if any
        if(request.getParent() != null){
            linkStudentToParent(student, request.getParent(), false);
        }
        if (request.getId() == null){
            // Create two commission requests for the SP and SCHOOL
            commissionService.create(student, Utils.COMMISSION_TYPE.SYSTEM, request.getTerm());
            commissionService.create(student, Utils.COMMISSION_TYPE.SCHOOL, request.getTerm());
        }
        return s;
    }

    @Override
    public void registerStudentViaBulk(BulkStudentLoadRequestDTO bulkRequest, Long schoolId) throws Exception {
        StudentRequestDTO request = new StudentRequestDTO(
                null,
                bulkRequest.getImage(),
                bulkRequest.getFirstName(),
                bulkRequest.getLastName(),
                bulkRequest.getMiddleName(),
                Utils.generateRandomRegNo(),
                schoolId,
                null,
                bulkRequest.getCardNo(),
                bulkRequest.getBalance(),
                bulkRequest.getDailyLimit(),
                bulkRequest.getClassName(),
                bulkRequest.getTerm(),
                false
        );
        StudentEntity student = registerStudent(request);
        // record Parent as primary parent.
        if (bulkRequest.getParentTelephone() != null && bulkRequest.getParentNames() != null){
            List<String> names = List.of(bulkRequest.getParentNames().split(" "));
            String middleName = names.size() > 2 ? names.get(1) : null;
            String lastName =  names.size() == 2 ? names.get(1) : names.size() > 2 ? names.get(2): "";
            String telephone = bulkRequest.getParentTelephone();// nfc_cardUtils.sanitizeMsisdn(bulkRequest.getParentTelephone(), null); // gives us 2567XXXXXX
            UserRequestDto parentUser =  new UserRequestDto(
                    null,
                    Utils.ACCOUNT_TYPE.PARENT,
                    telephone, // make sure we have the phone number
                    telephone,// default password is their phone number
                    Utils.ROLES.ROLE_PARENT,
                    bulkRequest.getParentEmail(),
                    null,
                    names.get(0),
                    lastName,
                    middleName,
                    telephone,
                    Utils.GENDER.UNKNOWN,
                    false,
                    null,
                    null,
                    null,
                    false
            );
            ParentUser parent = (ParentUser) userService.registerOrUpdateUser(parentUser);
            if(schoolId != null){
                parent.setSchool(student.getSchool());
            }
            student.setPrimaryParent(parent);
            studentRepository.save(student);
            log.info("Student account {} has been created via bulk", student);
            // create request and approve it
            ApprovalRequestCreateDTO r = new ApprovalRequestCreateDTO();
            r.setStudentId(student.getId());
            r.setType(Utils.APPROVAL_TYPES.SCHOOL_APPROVAL);
            r.setParent(parent.getId());
            SchoolApprovalRequest approvalRequest = (SchoolApprovalRequest) approvalRequestService.createApprovalRequest(r, true);
            // approve it
            approvalRequestService.approvePrimaryParent(approvalRequest, true,true, true);
            if (bulkRequest.getBalance() > 0){
                WalletDepositDTO deposit =  new WalletDepositDTO();
                deposit.setAmount(bulkRequest.getBalance());
                deposit.setStudentId(student.getId());
                deposit.setCardNo(student.getWalletAccount().getCardNo());
                deposit.setIsSystem(true);
                deposit.setEnv(PRODUCTION);
                // create a collection transaction
                // db trigger will update the school collections account
                walletService.depositIntoWallet(deposit);
            }

        }else{
            log.warn(String.format("Could not create parent user for student %s since phone number is not provided", student));
        }
    }

    @Override
    public StudentEntity findById(Long id) {
       try{
           return studentRepository.findById(id).get();
       }catch (NoSuchElementException e){
           throw new EntityNotFoundException();
       }
    }

    @Override
    public Page<StudentEntity> findBySchool(Long schoolId, int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        School school = schoolRepository.findById(schoolId).get();
        return studentRepository.findStudentEntitiesBySchool(school, pageable);
    }

    @Override
    public Page<StudentEntity> findAll(int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return studentRepository.findAll(pageable);
    }

    @Override
    public Page<StudentEntity> findStudentBySchoolAndClass(Long schoolId, Long classRoomId, int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        School school = schoolRepository.findById(schoolId).get();
        ClassRoom classRoom =  classRoomRepository.findById(classRoomId).get();
        return studentRepository.findStudentEntitiesBySchoolAndClassRoom(school, classRoom,pageable);
    }

    @Override
    public void linkStudentToParent(StudentEntity student, Long parentId, boolean editing) {
        ParentUser parentUser = (ParentUser) userRepository.findUserById(parentId);
        if(parentUser != null){
            List<ParentUser> parents = student.getParents();
            parents =  parents != null ? parents : new ArrayList<>();
            if (editing || student.getPrimaryParent() == null){
                student.setPrimaryParent(parentUser); //  if is primary is explicitly set or has no parent attached
                StudentWalletAccount account = student.getWalletAccount();
                account.setStatus(Utils.WALLET_STATUS.ACTIVE);// activate their wallet
                walletAccountRepository.save(account);
                if(!editing){
                    // create card provisioning request when we are not just editing
                    walletService.createCardProvisioningRequest(student);
                }
            }else{
                // contributors
                student.setParents(parents);
                parents.add(parentUser);
            }
            studentRepository.save(student);
        }else{
            log.warn(String.format("Could not link Parent Id %s to student %s: Parent Id does not exist", parentId, student.getLastName()));
        }

    }
}
