package com.oddjobs.dtos.requests;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CardProvisioningMarkRequest {
    private Long requestId;
    private List<Long> requestIds= new ArrayList<>();
}
