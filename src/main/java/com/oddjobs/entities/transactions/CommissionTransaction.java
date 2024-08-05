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
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.subscriptions.CommissionRequestEntity;
import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.entities.users.User;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.CommissionAccount;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@DiscriminatorValue(value= Utils.TRANSACTION_TYPE.Values.COMMISSIONS)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version",
        "createdAt","createdBy","lastModifiedAt",
        "lastModifiedBy","deleted","enabled", "receiver"})
public  class CommissionTransaction extends Transaction {

    @ManyToOne
    private StudentEntity student;

    @ManyToOne
    private StudentWalletAccount debitAccount; // must be a student account

    @ManyToOne
    private CommissionAccount creditAccount; // must be a commissions account

    @OneToOne
    private CommissionRequestEntity request;
    @Override
    public String toString() {
        return "CollectionTransaction{" +
                ", student=" + student +
                '}';
    }

    @Transient
    public Utils.COMMISSION_TYPE kind(){
        return request.getType();
    }

    public CommissionTransaction updateFields() throws Exception {
        if (request == null){
            throw new Exception("Commission request is null, first set it on the instance then call this method");
        }

        setSchool(request.getStudent().getSchool());
        setStudent(request.getStudent());
        setAmount(request.getAmount());
        setNature(Utils.TRANSACTION_NATURE.DEBIT);// we are debiting(deducting in this case)  student account
        return this;
    }
}
