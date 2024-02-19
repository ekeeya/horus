package com.oddjobs.dtos.flutterwave.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class StatusCustomer implements Serializable {
    private Number id;
    private String name;
    private String phone_number;
    private String email;
    private String created_at;
}
