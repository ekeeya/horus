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

package com.oddjobs.entities.subscriptions;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.oddjobs.entities.BaseEntity;
import com.oddjobs.entities.School;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@DynamicInsert
@DynamicUpdate
@Transactional
@Setter
@Getter
@Table(name="subscription", indexes = {@Index(name="subscription_idx1", columnList = "school_id")})
public class Subscription extends BaseEntity {

    @ManyToOne
    @JoinColumn(name="school_id", nullable=false)
    private School school;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "start_date", insertable = false,columnDefinition = "TIMESTAMP NOT NULL DEFAULT NOW()")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "end_date", insertable = false,columnDefinition = "TIMESTAMP NOT NULL DEFAULT NOW()")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;

    @Enumerated(EnumType.STRING)
    private  Utils.SUBSCRIPTION_PLAN plan = Utils.SUBSCRIPTION_PLAN.TERMLY;

    @Enumerated(EnumType.STRING)
    private Utils.SUBSCRIPTION_STATE state= Utils.SUBSCRIPTION_STATE.INACTIVE;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER_FLOAT)
    @Column(name = "amount")
    private BigDecimal amount = new BigDecimal(0); // in case of a one off

    @JsonFormat(shape = JsonFormat.Shape.NUMBER_FLOAT)
    @Column(name = "rate") // commission rate
    private Double rate = 0.2;

    @Transient
    public Boolean isActive() {
        return this.getState() == Utils.SUBSCRIPTION_STATE.ACTIVE;
    }

    @Override
    public String toString() {
        return "Subscription{" +
                "school=" + school.getName() +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", state=" + state +
                ", amount=" + amount +
                ", rate=" + rate +
                '}';
    }
}
