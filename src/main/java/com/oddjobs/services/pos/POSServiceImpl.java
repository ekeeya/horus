package com.oddjobs.services.pos;

import com.oddjobs.dtos.requests.POSCenterRequestDTO;
import com.oddjobs.dtos.requests.UserRequestDto;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.School;
import com.oddjobs.exceptions.PosCenterNotFoundException;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.exceptions.UserNameAlreadyExists;
import com.oddjobs.exceptions.UserNotFoundException;
import com.oddjobs.repositories.pos.PosAttendantRepository;
import com.oddjobs.repositories.pos.PosCenterRepository;
import com.oddjobs.repositories.transactions.PaymentTransactionRepository;
import com.oddjobs.repositories.users.UserRepository;
import com.oddjobs.services.schools.SchoolService;
import com.oddjobs.services.users.UserService;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.users.POSAttendant;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class POSServiceImpl implements POSService{

    private final PosCenterRepository posCenterRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final SchoolService schoolService;
    private final PosAttendantRepository posAttendantRepository;
    @Override
    public PosCenterEntity registerPOSCenter(POSCenterRequestDTO requestDTO) throws SchoolNotFoundException, PosCenterNotFoundException, UserNameAlreadyExists {
        // Query the school
        School school =  schoolService.findById(requestDTO.getSchoolId());
        PosCenterEntity pos;
        if(requestDTO.getId() != null){
            pos =  findById(requestDTO.getId());
        }
        else{
            pos = new PosCenterEntity();
            pos.setSchool(school);
        }

        pos.setName(requestDTO.getName());
        // if a user is specified
        pos = posCenterRepository.save(pos);
        if(requestDTO.getAttendant() != null){
            UserRequestDto attendant = requestDTO.getAttendant();
            attendant.setPosCenterId(pos.getId());
            attendant.setAccountType(Utils.ACCOUNT_TYPE.POS);
            attendant.setRole(Utils.ROLES.ROLE_POS);
            attendant.setSchoolId(school.getId());
            POSAttendant user = (POSAttendant) userService.registerOrUpdateUser(attendant);
            List<POSAttendant> attendants =  pos.getAttendants()!=null ?pos.getAttendants() : new ArrayList<>();
            attendants.add(user);
            pos.setAttendants(attendants);
        }
        return pos;
    }

    @Override
    public POSAttendant findAttendantById(Long id) throws UserNotFoundException {
        try{
            return posAttendantRepository.findById(id).get();
        }catch (NoSuchElementException e){
            throw  new UserNotFoundException(id);
        }
    }

    @Override
    public PosCenterEntity findById(Long id) throws PosCenterNotFoundException {
        try{
            return posCenterRepository.findById(id).get();
        }catch (NoSuchElementException e){
            throw  new PosCenterNotFoundException(id);
        }
    }

    @Override
    public List<PosCenterEntity> getPosCentersbySchool(Long schoolId) throws SchoolNotFoundException {
       School school = schoolService.findById(schoolId);
        return posCenterRepository.findPosCenterEntitiesBySchool(school);
    }

    @Override
    public void addRemoveAttendantToPosCenter(PosCenterEntity posCenter, POSAttendant attendant, boolean add) throws Exception {
        // query posCenter
        List<POSAttendant> attachedAttendants = posCenter.getAttendants() !=null ? posCenter.getAttendants() : new ArrayList<>();
        if (add){
            if (!attachedAttendants.contains(attendant)){
                // add them
                attachedAttendants.add(attendant);
                attendant.setPosCenter(posCenter);
                attendant.setSchool(posCenter.getSchool());
            }else{
                throw new Exception(String.format("%s %s is already attached to pos Center %s.", attendant.getFirstName(), attendant.getLastName(), posCenter));
            }
        }else{
            if (attachedAttendants.contains(attendant)){
                // remove them
                attachedAttendants.remove(attendant);
                attendant.setPosCenter(null);
                attendant.setSchool(posCenter.getSchool());
            }else{
                throw new Exception(String.format("%s %s is not an attendant at pos Center %s.", attendant.getFirstName(), attendant.getLastName(), posCenter));
            }
        }
        userRepository.save(attendant);
        posCenter.setAttendants(attachedAttendants);
        posCenterRepository.save(posCenter);
    }

    @Override
    public Page<PaymentTransaction> fetchPaymentsByPosCenter(Long posCenterId, Date lowerdate, Date upperDate, int page, int size) throws PosCenterNotFoundException {
        PosCenterEntity posCenter = findById(posCenterId);
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        if (lowerdate !=null && upperDate !=null){
            return paymentTransactionRepository.findPaymentTransactionsByAttendant_PosCenterAndCreatedAtBetween(posCenter, lowerdate, upperDate,pageable);
        }
        return paymentTransactionRepository.findPaymentTransactionsByAttendant_PosCenter(posCenter, pageable);
    }

    @Override
    public Page<PaymentTransaction> fetchPaymentsByAttendant(Long attendantId, Date lowerdate, Date upperDate, int page, int size) throws UserNotFoundException {
        try{
            POSAttendant attendant = posAttendantRepository.findById(attendantId).get();
            Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
            if(lowerdate != null && upperDate !=null){
                return  paymentTransactionRepository.findPaymentTransactionsByAttendantAndCreatedAtBetween(attendant, lowerdate, upperDate,pageable);
            }
            return paymentTransactionRepository.findPaymentTransactionsByAttendant(attendant, pageable);
        }catch (NoSuchElementException e){
            throw  new UserNotFoundException(attendantId);
        }
    }
}
