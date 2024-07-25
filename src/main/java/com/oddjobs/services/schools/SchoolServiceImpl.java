package com.oddjobs.services.schools;

import com.oddjobs.dtos.requests.ClassRoomDTO;
import com.oddjobs.dtos.requests.SchoolRequestDTO;
import com.oddjobs.dtos.requests.SubscriptionRequestDTO;
import com.oddjobs.dtos.requests.UserRequestDto;
import com.oddjobs.entities.ClassRoom;
import com.oddjobs.entities.School;
import com.oddjobs.entities.wallets.*;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.repositories.school.ClassRoomRepository;
import com.oddjobs.repositories.school.SchoolRepository;
import com.oddjobs.repositories.users.SchoolUserRepository;
import com.oddjobs.repositories.wallet.WalletAccountRepository;
import com.oddjobs.services.CustomRunnable;
import com.oddjobs.services.IdentifiableRunnable;
import com.oddjobs.services.TransactionalExecutorService;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.services.users.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SchoolServiceImpl implements SchoolService{

    private final SchoolRepository schoolRepository;
    private final UserService userService;
    private final SchoolUserRepository schoolUserRepository;
    private final ClassRoomRepository classRoomRepository;
    private final WalletAccountRepository walletAccountRepository;
    private final TransactionalExecutorService executorService;
    private final SubscriptionService subscriptionService;

    @Override
    public Long register(SchoolRequestDTO request) {

        Function<Long, Long> future = x -> {
            try{
                School school;
                if (request.getId() != null){
                    school =  findById(request.getId());
                }
                else{
                    school =  new School();
                }
                school.setName(request.getName());
                school.setAddress(request.getAddress());
                school.setSystemFeePerStudentPerTerm(request.getSystemCommissionFee());
                school.setSchoolFeePerStudentPerTerm(request.getSchoolCommissionFee());
                school.setPrimaryContact(request.getPrimaryContact());
                school.setAlias(request.getAlias());
                school = schoolRepository.save(school);

                if(request.getId() == null){
                    // create school wallet account;
                    SchoolCollectionAccount account =  new SchoolCollectionAccount();
                    account.setName(school.getName());
                    account.setSchool(school);
                    walletAccountRepository.save(account);

                    // create school commissions account
                    CommissionAccount commissionAccount =  new CommissionAccount();
                    commissionAccount.setName(school.getName() +"-Commission");
                    commissionAccount.setSchool(school);
                    commissionAccount.setEnabled(true);
                    walletAccountRepository.save(commissionAccount);

                    // Withdraw school account
                    SchoolWithdrawAccount withdrawAccount =  new SchoolWithdrawAccount();
                    withdrawAccount.setSchool(school);
                    withdrawAccount.setName(school.getName()+" Withdraw");
                    walletAccountRepository.save(withdrawAccount);
                    // Payment school account
                    SchoolPaymentAccount paymentAccount =  new SchoolPaymentAccount();
                    paymentAccount.setSchool(school);
                    paymentAccount.setName(school.getName()+" Payment");
                    walletAccountRepository.save(paymentAccount);
                }
                // check if Classes were provided and add them
                List<ClassRoom> requestRooms = new ArrayList<>();
                    if(request.getClasses()!=null && !request.getClasses().isEmpty()){
                    for (String clazz: request.getClasses()) {
                        ClassRoom room;
                        if(!classRoomRepository.existsClassRoomByNameAndSchool(clazz, school)){
                            room =  new ClassRoom();
                            room.setName(clazz);
                            room.setSchool(school);
                            room = classRoomRepository.save(room);
                        }else{
                            room = classRoomRepository.findClassRoomByNameAndSchool(clazz, school);
                        }
                        requestRooms.add(room);
                    }
                    // if it does not in request but not db, remove it from db
                    List<ClassRoom> originalRooms = classRoomRepository.findClassRoomsBySchoolOrderByNameDesc(school);
                    originalRooms.removeAll(requestRooms);
                    // remove those that aren't in the request
                    classRoomRepository.deleteAll(originalRooms);
                }
                //check if user is provided
                if(request.getUser() != null){
                    UserRequestDto u =  request.getUser();
                    u.setSchoolId(school.getId());
                    userService.registerOrUpdateUser(request.getUser());
                }
                // Also add a subscription, for future use, currently it the commission system
                SubscriptionRequestDTO subscriptionRequest = new SubscriptionRequestDTO(null,school.getId(), null, null,0.0,
                        school.getSystemFeePerStudentPerTerm(), Utils.SUBSCRIPTION_PLAN.MONTHLY );
                subscriptionService.register(subscriptionRequest);
                return school.getId();
            }catch (Exception e){
                throw new RuntimeException(e);
            }
        };
        IdentifiableRunnable customRunnable = new CustomRunnable(future);
        return executorService.executeInTransaction(customRunnable);
    }

    @Override
    public School findById(Long id) throws SchoolNotFoundException {
        try{
            return schoolRepository.findById(id).get();
        }catch (Exception e){
            throw new SchoolNotFoundException(id);
        }
    }

    @Override
    public ClassRoom createClassRoom(ClassRoomDTO request) throws SchoolNotFoundException {
        School school = findById(request.getSchool());
        ClassRoom classRoom;
        if(!classRoomRepository.existsClassRoomByNameAndSchool(request.getName(), school)){
            classRoom= new ClassRoom();
            classRoom.setName(request.getName());
            classRoom.setSchool(school);
            return  classRoomRepository.save(classRoom);
        }else{
            classRoom = classRoomRepository.findClassRoomByNameAndSchool(request.getName(), school);
        }
       return classRoom;
    }


    @Override
    public Page<School> fetchAll(int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return schoolRepository.findAll(pageable);
    }

    @Override
    public Page<School> searchByNameLike(String name, int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return schoolRepository.findSchoolsByNameLike(name,pageable);
    }



    @Override
    public void setCommissionFee(Long schoolId, Double fee, Double schoolFee) throws SchoolNotFoundException {
        School school =  findById(schoolId);
        if (fee != null){
            school.setSystemFeePerStudentPerTerm(fee);
        }
        if (schoolFee !=null){
            school.setSchoolFeePerStudentPerTerm(schoolFee);
        }

        schoolRepository.save(school);
    }

    @Override
    public void schoolAccountManagement(Utils.ACCOUNT_ACTIONS action, Long schoolId) throws Exception {
        School school =  findById(schoolId);
        school.setEnabled(false);
        List<SchoolUser> users = schoolUserRepository.findUsersBySchool(school);
        // Update school users attached to this school.
        for (User user: users){
            userService.accountManagement(action,user.getId());
        }

    }

    @Override
    public long countSchools() {
        return schoolRepository.count();
    }
}
