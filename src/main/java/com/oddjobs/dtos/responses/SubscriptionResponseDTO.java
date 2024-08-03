package com.oddjobs.dtos.responses;

import com.oddjobs.dtos.base.BaseRequest;
import com.oddjobs.entities.subscriptions.Subscription;
import com.oddjobs.utils.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class SubscriptionResponseDTO extends BaseRequest {
    private Long id; // in update cases
    private Long schoolId;
    private Date startDate;
    private   Utils.SUBSCRIPTION_STATE state;
    private Date endDate;
    private Double amount; // for one offs
    private Utils.SUBSCRIPTION_PLAN plan;

    public SubscriptionResponseDTO (Subscription subscription){
        this.id=subscription.getId();
        setAmount(subscription.getAmount().doubleValue());
        setPlan(subscription.getPlan());
        setEndDate(subscription.getEndDate());
        setStartDate(subscription.getStartDate());
        setSchoolId(subscription.getSchool().getId());
        setState(subscription.getState());
    }

}
