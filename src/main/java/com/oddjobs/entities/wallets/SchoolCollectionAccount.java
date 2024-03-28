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
@DiscriminatorValue(value= Utils.WALLET_ACCOUNT_TYPES.Values.SCHOOL_COLLECTION)
public class SchoolCollectionAccount extends  AccountEntity{

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;
}
