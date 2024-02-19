/*
 * Online auctioning system
 *
 * Copyright (c) 2023.  Oddjobs an alias for the author of this software. - www.skycastleauctionhub.com
 *
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@oddjobs.tech <ekeeya@oddjobs.tech>.
 *
 * This program is not free software.
 *
 * NOTICE: All information contained herein is, and remains the property of Oddjobs. - www.oddjobs.tech
 */

package com.oddjobs.entities.transactions;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.entities.BaseEntity;
import com.oddjobs.entities.School;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Entity
@DynamicInsert
@DynamicUpdate
@Transactional
@DiscriminatorColumn(name = "transactionType")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Data
@Table(name="transaction")
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version", "createdAt","createdBy","lastModifiedAt", "lastModifiedBy","deleted","enabled"})
public abstract class Transaction extends BaseEntity {

    @Column(name = "transaction_id")
    private String transactionId;

    @Enumerated(EnumType.STRING)
    private Utils.TRANSACTION_STATUS status =  Utils.TRANSACTION_STATUS.PENDING;

    private String currency;

    @Enumerated(EnumType.STRING)
    private Utils.TRANSACTION_NATURE nature;

    @Enumerated(EnumType.STRING)
    @Column(insertable=false, updatable=false)
    private Utils.TRANSACTION_TYPE transactionType;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "school_id", referencedColumnName = "id")
    private School school;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal amount=new BigDecimal(0);

    @Override
    public String toString() {
        return "Transaction{" +
                "transactionId='" + transactionId + '\'' +
                ", status=" + status +
                ", currency='" + currency + '\'' +
                ", nature=" + nature +
                ", transactionType=" + transactionType +
                ", school=" + school.getName() +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                '}';
    }
}
