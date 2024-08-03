package com.oddjobs.services.schools.subscriptions;

import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.subscriptions.CommissionRequestEntity;
import com.oddjobs.utils.Utils;

import java.util.List;

public interface CommissionService {

    List<CommissionRequestEntity > getPendingByStudent(StudentEntity student);
    CommissionRequestEntity create(StudentEntity student, Utils.COMMISSION_TYPE type, Utils.COMMISSION_TERM term) throws Exception;
    void cancel(CommissionRequestEntity commissionRequest);
    void deductCommission();
    void createCommissionDeductionRequestsBySchool(School school,  Utils.COMMISSION_TERM term);

    boolean hasPendingCommissionDeduction(StudentEntity student);
}
