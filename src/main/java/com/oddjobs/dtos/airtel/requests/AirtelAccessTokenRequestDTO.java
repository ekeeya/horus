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

package com.oddjobs.dtos.airtel.requests;

import lombok.Data;

import java.io.Serializable;

@Data
public class AirtelAccessTokenRequestDTO implements Serializable {
    private String client_id;
    private String client_secret;
    private String grant_type="client_credentials";

    public AirtelAccessTokenRequestDTO(String client_id, String client_secret){
        this.client_id=client_id;
                this.client_secret=client_secret;
    }
}
