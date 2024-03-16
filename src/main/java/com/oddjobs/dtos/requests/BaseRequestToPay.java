package com.oddjobs.dtos.requests;

import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;

@Data
public abstract class BaseRequestToPay implements Serializable {
    private Utils.PROVIDER provider;
    private Double amount;
}
