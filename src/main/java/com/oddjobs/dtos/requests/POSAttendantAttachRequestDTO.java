package com.oddjobs.dtos.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class POSAttendantAttachRequestDTO implements Serializable {

    @NotNull
    private Long posCenterId;
    @NotNull
    private List<Long> attendants;
    @NotNull
    private boolean add;
}
