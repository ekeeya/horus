package com.oddjobs.services.schools.subscriptions;

import com.oddjobs.dtos.requests.CommissionOrderRequestDTO;
import com.oddjobs.dtos.requests.SubscriptionRequestDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.subscriptions.Subscription;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.repositories.school.SchoolRepository;
import com.oddjobs.repositories.school.SubscriptionRepository;
import com.oddjobs.repositories.students.StudentRepository;
import com.oddjobs.utils.Utils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SchoolRepository schoolRepository;
    private final CommissionService commissionService;
    private final StudentRepository studentRepository;

    @Override
    public Subscription register(SubscriptionRequestDTO request) throws SchoolNotFoundException {
        Subscription subscription = new Subscription();
        School school;
        if (schoolRepository.findById(request.getSchoolId()).isPresent()) {
            school = schoolRepository.findById(request.getSchoolId()).get();
        } else {
            throw new SchoolNotFoundException(request.getSchoolId());
        }
        subscription.setSchool(school);
        subscription.setPlan(request.getPlan());
        subscription.setAmount(BigDecimal.valueOf(request.getAmount()));
        subscription.setRate(request.getRate());
        return subscriptionRepository.save(subscription);
    }

    @Override
    public void activate(School school, Utils.COMMISSION_TERM term, Date startDate) throws Exception {
        // look it up

        Subscription subscription = subscriptionRepository.findSubscriptionBySchool(school);
        if (subscription != null) {
            Calendar calendar = Calendar.getInstance();
            if (startDate == null) {
                startDate = Calendar.getInstance().getTime();
            }
            // compute endDate
            calendar.setTime(startDate);
            calendar.add(Calendar.MONTH, subscription.getPlan().getMonths());
            Date endDate = calendar.getTime();
            subscription.setStartDate(startDate);
            subscription.setEndDate(endDate);

            if (subscription.isActive()) {
                String error = String.format("Subscription: %s is already Active", subscription);
                throw new Exception(error);
            }
            subscription.setState(Utils.SUBSCRIPTION_STATE.ACTIVE);
            subscriptionRepository.save(subscription);
            int activeStudents = studentRepository.countActiveBySchool(subscription.getSchool());
            // create the commissions deduction request order
            CommissionOrderRequestDTO request = CommissionOrderRequestDTO.builder()
                    .term(term)
                    .year(calendar.get(Calendar.YEAR))
                    .executeOn(subscription.getStartDate())
                    .schoolId(subscription.getSchool().getId())
                    .totalCount(activeStudents)
                    .build();
            // now create the individual requests for each student
            commissionService.createCommissionDeductionRequestsBySchool(subscription.getSchool(), term);
        } else {
            throw new Exception("Could not find subscription school: " + school);
        }
    }

    @Override
    public void deactivate(Long subscriptionId) throws Exception {
        Subscription subscription = subscriptionRepository.findSubscriptionById(subscriptionId);
        if (subscription != null) {
            subscription.setState(Utils.SUBSCRIPTION_STATE.INACTIVE);
            subscriptionRepository.save(subscription);
        } else {
            throw new Exception("Could not find subscription with id: " + subscriptionId);
        }
    }
}
