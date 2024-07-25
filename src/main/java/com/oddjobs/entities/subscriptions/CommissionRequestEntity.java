package com.oddjobs.entities.subscriptions;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.oddjobs.entities.BaseEntity;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.math.BigDecimal;

@Entity
@DynamicInsert
@DynamicUpdate
@Transactional
@Setter
@Getter
@Table(name="commission_request", indexes = {@Index(name="student_idx1", columnList = "student_id")})
public class CommissionRequestEntity extends BaseEntity {

    @ManyToOne
    @JoinColumn(name="student_id", nullable=false)
    private StudentEntity student;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER_FLOAT)
    @Column(name = "amount")
    private BigDecimal amount = new BigDecimal(0);

    @Enumerated(EnumType.STRING)
    private Utils.COMMISSION_STATUS status = Utils.COMMISSION_STATUS.PENDING;

    @Enumerated(EnumType.STRING)
    private Utils.COMMISSION_TYPE type = Utils.COMMISSION_TYPE.SYSTEM;

    private Integer year;

    @Enumerated(EnumType.STRING)
    private Utils.COMMISSION_TERM term;


    @Transient
    public boolean applicable(){
        return amount.compareTo(student.getWalletAccount().getBalance()) <= 0;
    }

    @Override
    public String toString() {
        return "CommissionRequestEntity{" +
                "student=" + student +
                ", amount=" + amount +
                ", status=" + status +
                ", year=" + year +
                ", term=" + term +
                '}';
    }
}
