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

import com.oddjobs.utils.Utils;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue(value= Utils.TRANSACTION_TYPE.Values.PAYMENT)
public class PaymentTransaction extends  Transaction{

    @OneToOne
    @JoinColumn(name = "attendant", referencedColumnName = "id")
    private POSAttendant attendant;

    @OneToOne
    @JoinColumn(referencedColumnName = "id")
    private StudentWalletAccount debitAccount;
}
