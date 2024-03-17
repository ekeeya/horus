package com.oddjobs.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.math.BigDecimal;
import java.util.List;

@Entity
@DynamicInsert
@DynamicUpdate
@Transactional
@JsonIgnoreProperties(ignoreUnknown = true,value = {"version", "createdAt","lastModifiedAt", "lastModifiedBy", "createdBy", "enabled", "deleted"})
@Setter
@Getter
public class WithdrawRequest extends BaseEntity{
    public static enum Status {
        APPROVED, CANCELLED, PENDING, PROCESSED
    }

    public static enum TYPE {
        CASH_OUTS, PAYMENTS
    }

    private String referenceNo= Utils.generateRandomRefNo();



    @Enumerated(EnumType.STRING)
    private Status status= Status.PENDING;

    @Enumerated(EnumType.STRING)
    private TYPE type;

    @ManyToOne
    @JoinColumn(name="school_id", nullable=false, referencedColumnName = "id")
    private School school;

    private BigDecimal amount=new BigDecimal(0);

    @Column(columnDefinition = "TEXT")
    private String cancelReason;

    @OneToMany
    private List<Image> receipts;

    @Override
    public String toString() {
        return "WithdrawRequest{" +
                "referenceNo='" + referenceNo + '\'' +
                ", status=" + status +
                ", amount=" + amount +
                ", school=" + school.getName() +
                ", cancelReason='" + cancelReason + '\'' +
                '}';
    }

    @Transient
    public BigDecimal amountReceived(){
        double rate = school.getCommissionRate();
        double amountReceived = amount.doubleValue() * rate;
        return new BigDecimal(amountReceived);
    }
}
