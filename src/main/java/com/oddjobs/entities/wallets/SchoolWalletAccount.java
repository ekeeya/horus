package com.oddjobs.entities.wallets;

import com.oddjobs.entities.School;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@DiscriminatorValue(value= Utils.WALLET_ACCOUNT_TYPES.Values.SCHOOL)
public class SchoolWalletAccount extends  AccountEntity{

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "school_id", unique = true)
    private School school;
}
