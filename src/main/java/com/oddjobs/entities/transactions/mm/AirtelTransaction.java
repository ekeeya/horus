package com.oddjobs.entities.transactions.mm;

import com.oddjobs.utils.Utils;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Transient;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue(value= Utils.PROVIDER.Values.AIRTEL)
public class AirtelTransaction extends MMTransaction{

    @Column(name="response_code")
    private String responseCode;

    @Transient
    public String message(){
        return Utils.AIRTEL_CODES.valueOf(this.responseCode).name();
    }
}
