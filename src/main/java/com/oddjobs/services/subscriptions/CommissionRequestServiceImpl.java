package com.oddjobs.services.subscriptions;

import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.subscriptions.CommissionRequestEntity;
import com.oddjobs.repositories.subscriptions.CommissionRequestRepository;
import com.oddjobs.utils.Utils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class CommissionRequestServiceImpl implements CommissionRequestService {

    private final CommissionRequestRepository crRepository;

    @Override
    public List<CommissionRequestEntity> getPendingByStudent(StudentEntity student) {
        return crRepository.findByStudentAndStatus(student, Utils.COMMISSION_STATUS.PENDING);
    }

    @Override
    public CommissionRequestEntity create(StudentEntity student, Utils.COMMISSION_TYPE type) throws Exception {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        Utils.COMMISSION_TERM term;
        if (month <=5){
            term = Utils.COMMISSION_TERM.I;
        } else if (month  <=9) {
            term = Utils.COMMISSION_TERM.II;
        }
        else{
            term = Utils.COMMISSION_TERM.III;
        }
        CommissionRequestEntity crRequest = new CommissionRequestEntity();
        CommissionRequestEntity existing  = crRepository.findByStudentAndYearAndTermAndType(student,year, term, type);
        if (existing != null){
            String error = String.format("Commission request : %s already exists",  existing);
            throw new Exception(error);
        }
        crRequest.setTerm(term);
        crRequest.setType(type);
        crRequest.setYear(year);
        crRequest.setStudent(student);
        BigDecimal amount =  type == Utils.COMMISSION_TYPE.SYSTEM ?
                BigDecimal.valueOf(student.getSchool().getSystemFeePerStudentPerTerm()) :
                BigDecimal.valueOf(student.getSchool().getSchoolFeePerStudentPerTerm());
        crRequest.setAmount(amount);
        return crRepository.save(crRequest);
    }

    @Override
    public void cancel(CommissionRequestEntity commissionRequest) {
        commissionRequest.setStatus(Utils.COMMISSION_STATUS.CANCELLED);
    }

    @Override
    public void deductCommission(CommissionRequestEntity commissionRequest) {
        // Take off our amount and add it to the
        List<CommissionRequestEntity> pending = crRepository.findByStatus(Utils.COMMISSION_STATUS.PENDING);
    }
}
