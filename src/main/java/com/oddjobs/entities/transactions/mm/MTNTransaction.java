package com.oddjobs.entities.transactions.mm;


import com.oddjobs.utils.Utils;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue(value= Utils.PROVIDER.Values.MTN)
public class MTNTransaction extends MMTransaction{
    @Column(name = "x_reference_id", unique = true)
    private String xReferenceId;

    @Override
    public String toString() {
        return "{" + super.toString()+
                "xReferenceId='" + xReferenceId + '\'' +
                '}';
    }
}
