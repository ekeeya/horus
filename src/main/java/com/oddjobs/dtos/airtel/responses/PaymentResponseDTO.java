/*
 * Online auctioning system
 * Copyright (C) 2023 - , Sky Castle Auction Hub ltd. - www.skycastleauctionhub.com
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@skycastleauctionhub.com <ekeeya@skycastleauctionhub.com>
 *
 * This program is not free software
 * NOTICE: All information contained herein is, and remains the property of Sky Castle Auction Hub ltd. - www.skycastleauctionhub.com
 *
 */

package com.oddjobs.dtos.airtel.responses;

import lombok.Data;

import java.io.Serializable;
import java.util.Map;

@Data
public class PaymentResponseDTO implements Serializable {

    public Map<String, Map<String, String>> data;
    public PaymentStatus status;
}
