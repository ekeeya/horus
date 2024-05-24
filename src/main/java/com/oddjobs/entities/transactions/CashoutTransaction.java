/*
 *
 *
 * Copyright (c) 2023.  Oddjobs an alias for the author of this software.
 *
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@oddjobs.tech <ekeeya@oddjobs.tech>.
 *
 * This program is not free software.
 *
 * NOTICE: All information contained herein is, and remains the property of Oddjobs. - www.oddjobs.tech
 */

package com.oddjobs.entities.transactions;

import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.utils.Utils;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue(value= Utils.TRANSACTION_TYPE.Values.CASH_OUT)
public class CashoutTransaction extends  Transaction{

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    private StudentWalletAccount debitAccount;

    @Override
    public String toString() {
        return super.toString();
    }
}
