package com.oddjobs.entities.transactions.mm;

import com.oddjobs.entities.BaseEntity;
import com.oddjobs.utils.Utils;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;


@Entity
@DynamicInsert
@DynamicUpdate
@Transactional
@DiscriminatorColumn(name = "provider")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Setter
@Getter
@Table(name="mm_transaction")
public abstract class MMTransaction  extends BaseEntity {

    @Column(name = "transaction_id", unique = true)
    private String transactionId;

    @Enumerated(EnumType.STRING)
    private Utils.TRANSACTION_STATUS status =  Utils.TRANSACTION_STATUS.PENDING;

    private String msisdn;

    private String currency = "UGX";

    private String reason;

    @Enumerated(EnumType.STRING)
    private Utils.TRANSACTION_TYPE transactionType = Utils.TRANSACTION_TYPE.COLLECTION;


    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal amount=new BigDecimal(0);

    private BigDecimal charge=new BigDecimal(0);

    @Enumerated(EnumType.STRING)
    @Column(insertable=false, updatable=false)
    private Utils.PROVIDER provider;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Object response;

    @Override
    public String toString() {
        return "MMTransaction{" +
                "transactionId='" + transactionId + '\'' +
                ", status=" + status +
                ", msisdn='" + msisdn + '\'' +
                ", currency='" + currency + '\'' +
                ", transactionType=" + transactionType +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                ", provider=" + provider +
                '}';
    }
}
