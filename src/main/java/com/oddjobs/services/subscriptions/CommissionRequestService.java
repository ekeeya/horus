package com.oddjobs.services.subscriptions;

import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.subscriptions.CommissionRequestEntity;
import com.oddjobs.utils.Utils;

import java.util.List;

public interface CommissionRequestService {

    List<CommissionRequestEntity > getPendingByStudent(StudentEntity student);
    CommissionRequestEntity create(StudentEntity student, Utils.COMMISSION_TYPE type) throws Exception;
    void cancel(CommissionRequestEntity commissionRequest);
    void deductCommission(CommissionRequestEntity commissionRequest);

}
