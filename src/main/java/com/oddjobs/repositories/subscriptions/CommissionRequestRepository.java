package com.oddjobs.repositories.subscriptions;

import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.subscriptions.CommissionRequestEntity;
import com.oddjobs.utils.Utils;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommissionRequestRepository extends JpaRepository<CommissionRequestEntity, Long> {

    List<CommissionRequestEntity> findByStudentAndStatus(StudentEntity student, Utils.COMMISSION_STATUS  status);

    List<CommissionRequestEntity> findByStatus(Utils.COMMISSION_STATUS  status);

    CommissionRequestEntity findByStudentAndYearAndTerm(StudentEntity student, Integer year, Utils.COMMISSION_TERM term);
}
