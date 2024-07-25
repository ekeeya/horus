package com.oddjobs.entities.approvals;

import com.oddjobs.utils.Utils;
import com.oddjobs.entities.users.ParentUser;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue(value= Utils.APPROVAL_TYPES.Values.PARENT_APPROVAL)
@Data
public class ParentApprovalRequest extends ApprovalRequest{

    @ManyToOne
    private ParentUser secondaryParent;
}
