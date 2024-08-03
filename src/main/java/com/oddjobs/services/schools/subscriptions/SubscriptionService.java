package com.oddjobs.services.schools.subscriptions;

import com.oddjobs.dtos.requests.SubscriptionRequestDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.subscriptions.Subscription;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.utils.Utils;

import java.util.Date;

public interface SubscriptionService {

    Subscription register(SubscriptionRequestDTO request) throws SchoolNotFoundException;
    void activate(School school, Utils.COMMISSION_TERM term, Date startDate) throws Exception;
    void deactivate(Long subscriptionId) throws Exception;
}
