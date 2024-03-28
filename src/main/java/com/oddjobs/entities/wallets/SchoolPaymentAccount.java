package com.oddjobs.entities.wallets;

import com.oddjobs.entities.School;
import com.oddjobs.utils.Utils;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@DiscriminatorValue(value= Utils.WALLET_ACCOUNT_TYPES.Values.SCHOOL_PAYMENT)
public class SchoolPaymentAccount extends  AccountEntity{

    @ManyToOne
    @JoinColumn(name = "school_id", unique = true)
    private School school;
}
