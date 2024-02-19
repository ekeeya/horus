package com.oddjobs.entities.mm;

import com.oddjobs.utils.Utils;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue(value= Utils.PROVIDER.Values.EASY_PAY)
public class EasyPayProduct extends  MobileMoneyProduct{

    public static enum ResponseCodes{
        MR101("Success"),
        ER("Failed"),
        MR102("Pending"),
        MR103("Pending"),
        MR108("Pending"),
        MR109("Failed");
        String value;
        ResponseCodes(String value){
            this.value=value;
        };
    }
}
