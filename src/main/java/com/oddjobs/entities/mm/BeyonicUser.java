package com.oddjobs.entities.mm;

import com.oddjobs.utils.Utils;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue(value= Utils.PROVIDER.Values.BEYONIC)
public class BeyonicUser extends  APIUser{
    private String corporateCode;
    private String password;
    private String key;


    public static String computeMfsSign(Object inputs){
        return null;
    }
}
