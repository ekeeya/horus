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
public class BeyonicProduct extends MobileMoneyProduct{
}
