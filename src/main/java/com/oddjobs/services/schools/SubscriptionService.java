package com.oddjobs.services.schools;

import com.oddjobs.dtos.requests.SubscriptionRequestDTO;
import com.oddjobs.entities.subscriptions.Subscription;
import com.oddjobs.exceptions.SchoolNotFoundException;

import java.util.Date;

public interface SubscriptionService {

    Subscription register(SubscriptionRequestDTO request) throws SchoolNotFoundException;
    void activate(Long subscriptionId, boolean renew) throws Exception;
    void deactivate(Long subscriptionId) throws Exception;

    void renew(Long subscriptionId,Date startDate, boolean activate);
}
