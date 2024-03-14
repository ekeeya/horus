package com.oddjobs.services.schools;

import com.oddjobs.dtos.requests.SubscriptionRequestDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.subscriptions.Subscription;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.repositories.school.SchoolRepository;
import com.oddjobs.repositories.school.SubscriptionRepository;
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
    private  final SchoolRepository schoolRepository;
    @Override
    public Subscription register(SubscriptionRequestDTO request) throws SchoolNotFoundException {
        Subscription subscription = new Subscription();
        School school;
        if(schoolRepository.findById(request.getSchoolId()).isPresent()){
            school = schoolRepository.findById(request.getSchoolId()).get();
        }else{
            throw new SchoolNotFoundException(request.getSchoolId());
        }
        subscription.setSchool(school);
        subscription.setPlan(request.getPlan());
        subscription.setAmount(BigDecimal.valueOf(request.getAmount()));
        subscription.setRate(request.getRate());
        return subscriptionRepository.save(subscription);
    }

    @Override
    public void activate(Long subscriptionId, boolean renew) throws Exception {
        // look it up
        Subscription subscription =  subscriptionRepository.findSubscriptionById(subscriptionId);
        if (subscription != null){
            if( subscription.isActive() && !renew){
                String error = String.format("Subscription: %s is already Active", subscription);
                throw  new Exception(error);
            }
            subscription.setState(Utils.SUBSCRIPTION_STATE.ACTIVE);
            subscriptionRepository.save(subscription);
        }else{
            throw  new Exception("Could not find subscription with id: "+ subscriptionId);
        }
    }

    @Override
    public void deactivate(Long subscriptionId) throws Exception {
        Subscription subscription =  subscriptionRepository.findSubscriptionById(subscriptionId);
        if (subscription != null){
            subscription.setState(Utils.SUBSCRIPTION_STATE.INACTIVE);
            subscriptionRepository.save(subscription);
        }
        else{
            throw  new Exception("Could not find subscription with id: "+ subscriptionId);
        }
    }

    @Override
    public void renew(Long subscriptionId, Date startDate, boolean activate) {
        Subscription subscription =  subscriptionRepository.findSubscriptionById(subscriptionId);
        if (subscription != null){
            log.info("Entering renewal of Subscription {}", subscription);
            if (startDate == null){
                startDate = Calendar.getInstance().getTime();
            }
            // compute endDate
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            calendar.add(Calendar.MONTH, subscription.getPlan().getMonths());
            Date endDate = calendar.getTime();
            subscription.setStartDate(startDate);
            subscription.setEndDate(endDate);
            if (activate ){
                subscription.setState(Utils.SUBSCRIPTION_STATE.ACTIVE);
            }
            subscriptionRepository.save(subscription);
            log.info("Subscription {} has been renewed.", subscription);
        }

    }
}
