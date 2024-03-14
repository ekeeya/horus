package com.oddjobs.dtos.requests;

import com.oddjobs.dtos.base.BaseRequest;
import com.oddjobs.utils.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class SubscriptionRequestDTO extends BaseRequest {
    private Long id; // in update cases
    private Long schoolId;
    private Date startDate;
    private Date endDate;
    private Double amount; // for one offs
    private Double rate = 0.2;
    private Utils.SUBSCRIPTION_PLAN plan;
}
