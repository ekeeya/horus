package com.oddjobs.entities.wallets;

import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@ToString
@DiscriminatorValue(value= Utils.WALLET_ACCOUNT_TYPES.Values.SYSTEM)
public class CollectionAccount extends AccountEntity{
    private BigDecimal withdraws =  new BigDecimal(0);
}
