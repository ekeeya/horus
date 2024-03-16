package com.oddjobs.entities.transactions.mm.relworx;

import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.utils.Utils;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue(value= Utils.PROVIDER.Values.RELWORX)
public class RelworxTransaction extends MMTransaction {
    @Column(name = "internal_reference", unique = true)
    private String internal_reference;

    @Column(unique = true)
    private String reference;

}
