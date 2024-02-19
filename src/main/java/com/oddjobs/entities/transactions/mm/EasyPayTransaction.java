package com.oddjobs.entities.transactions.mm;

import com.oddjobs.utils.Utils;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue(value= Utils.PROVIDER.Values.EASY_PAY)
public class EasyPayTransaction extends MMTransaction{
    @Column(name = "reference", unique = true)
    private String reference;
}
