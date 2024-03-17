package com.oddjobs.dtos.requests;

import lombok.Data;

import java.io.Serializable;

@Data
public class CashOutRequestDTO implements Serializable {

    private Double amount;
    private String cardNo;
    private Long studentId;
}
