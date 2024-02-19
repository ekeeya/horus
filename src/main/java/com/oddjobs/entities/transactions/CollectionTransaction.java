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
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
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
    private ParentUser sender;

    @OneToOne(cascade = CascadeType.ALL)
    private StudentEntity receiver;

    @OneToOne(cascade = CascadeType.ALL)
    private StudentWalletAccount creditAccount;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "mm_transaction", referencedColumnName = "id")
    private MMTransaction mmTransaction;

    private BigDecimal totalPlusCharges;
}
