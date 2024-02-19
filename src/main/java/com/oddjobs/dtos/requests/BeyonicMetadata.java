package com.oddjobs.dtos.requests;

import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;

@Data
public class BeyonicMetadata implements Serializable {
    private String transactionId= Utils.generateTransactionId();
}
