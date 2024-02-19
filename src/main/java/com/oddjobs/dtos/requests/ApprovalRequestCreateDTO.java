package com.oddjobs.dtos.requests;
import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;

@Data
public class ApprovalRequestCreateDTO implements Serializable {

    private Utils.APPROVAL_TYPES type;
    private Long parent;
    private Long secondaryParentId;
    private Long studentId;
}
