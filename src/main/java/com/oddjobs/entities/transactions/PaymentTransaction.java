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

import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue(value= Utils.TRANSACTION_TYPE.Values.PAYMENT)
public class PaymentTransaction extends  Transaction{

    @ManyToOne
    @JoinColumn(name = "attendant_id", referencedColumnName = "id")
    private POSAttendant attendant;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    private StudentWalletAccount debitAccount;
}
