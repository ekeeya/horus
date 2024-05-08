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
import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.entities.users.User;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@DiscriminatorValue(value= Utils.TRANSACTION_TYPE.Values.COLLECTION)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version",
        "createdAt","createdBy","lastModifiedAt",
        "lastModifiedBy","deleted","enabled", "receiver"})
public  class CollectionTransaction extends Transaction {

    public CollectionTransaction(){
        setNature(Utils.TRANSACTION_NATURE.CREDIT);
    }

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id")
    private User sender;
    @ManyToOne
    private StudentEntity receiver;
    @ManyToOne
    @JoinColumn(name = "credit_account_id", referencedColumnName = "id")
    private StudentWalletAccount creditAccount;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "mm_transaction", referencedColumnName = "id")
    private MMTransaction mmTransaction;
    private BigDecimal totalPlusCharges;

    @Override
    public String toString() {
        return "CollectionTransaction{" +
                "sender=" + sender +
                ", receiver=" + receiver +
                ", creditAccount=" + creditAccount +
                ", mmTransaction=" + mmTransaction +
                ", totalPlusCharges=" + totalPlusCharges +
                '}';
    }
}