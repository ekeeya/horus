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
public class AirtelPaymentRequestDTO implements Serializable {


    public AirtelPaymentRequestDTO(String msisdn, Double amount, String id, String reference){
        AirtelTransaction trans =  new AirtelTransaction();
        trans.setId(id);
        trans.setAmount(amount);
        setTransaction(trans);
        Subscriber sub = new Subscriber();
        sub.setMsisdn(msisdn);
        setSubscriber(sub);
        this.reference=reference;
    }
    @Data
    public static class Subscriber implements Serializable {
        private  String country="UG";
        private String currency="UGX";
        private String msisdn;
    }
    @Data
    public static class AirtelTransaction implements Serializable {
        private Double amount;
        private String country="UG";
        private String currency="UGX";
        private String id;
    }
    private String reference;
    private Subscriber subscriber;
    private AirtelTransaction transaction;
}
