package com.oddjobs.dtos.requests;

import com.oddjobs.utils.Utils;
import lombok.Builder;
import lombok.Data;
import java.util.Date;

@Data
@Builder
public class CommissionOrderRequestDTO {
    private Long schoolId;
    private Date executeOn;
    private Integer year;
    private Utils.COMMISSION_TERM term;
    private Integer totalCount;
    private Integer totalExecuted;
}
