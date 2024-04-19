package com.oddjobs.entities.approvals;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.entities.BaseEntity;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.users.ParentUser;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorColumn(name = "type")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "approval_request")
@DynamicInsert
@DynamicUpdate
@Transactional
@JsonIgnoreProperties(ignoreUnknown = true,value = {"version", "createdAt","lastModifiedAt", "lastModifiedBy", "createdBy", "enabled", "deleted"})
@Data
public abstract class ApprovalRequest extends BaseEntity {

    public static enum Status {
        APPROVED, REJECTED, PENDING
    }

    @Column(nullable = false, insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private Utils.APPROVAL_TYPES type;

    private Boolean isApproved = false;

    @ManyToOne
    @JoinColumn(name="student_id")
    private StudentEntity student;

    @Enumerated(EnumType.STRING)
    private Status status=Status.PENDING;

    @ManyToOne
    @JoinColumn(name="primary_parent")
    private ParentUser primaryParent;

    @ManyToOne
    @JoinColumn(name="made_by")
    private ParentUser madeBy;
}
