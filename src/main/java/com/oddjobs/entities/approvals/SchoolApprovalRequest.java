package com.oddjobs.entities.approvals;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue(value= Utils.APPROVAL_TYPES.Values.SCHOOL_APPROVAL)
@Data
public class SchoolApprovalRequest extends  ApprovalRequest{
}
