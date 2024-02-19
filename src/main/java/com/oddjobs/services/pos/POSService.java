package com.oddjobs.services.pos;

import com.oddjobs.dtos.requests.POSCenterRequestDTO;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.exceptions.PosCenterNotFoundException;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.exceptions.UserNameAlreadyExists;
import com.oddjobs.exceptions.UserNotFoundException;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.users.POSAttendant;
import org.springframework.data.domain.Page;

import java.util.Date;
import java.util.List;

public interface POSService {

    PosCenterEntity registerPOSCenter(POSCenterRequestDTO requestDTO) throws SchoolNotFoundException, PosCenterNotFoundException, UserNameAlreadyExists;

    POSAttendant findAttendantById(Long id) throws UserNotFoundException;

    PosCenterEntity findById(Long id) throws PosCenterNotFoundException;

    List<PosCenterEntity> getPosCentersbySchool(Long schoolId) throws SchoolNotFoundException;

    void addRemoveAttendantToPosCenter(PosCenterEntity posCenter, POSAttendant attendant, boolean add) throws Exception;

    Page<PaymentTransaction> fetchPaymentsByPosCenter(Long posCenterId, Date lowerdate, Date upperDate, int page, int size) throws PosCenterNotFoundException;
    Page<PaymentTransaction> fetchPaymentsByAttendant(Long attendantId, Date lowerdate, Date upperDate, int page, int size) throws UserNotFoundException;
}
