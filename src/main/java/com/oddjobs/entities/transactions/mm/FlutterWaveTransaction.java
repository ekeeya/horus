package com.oddjobs.entities.transactions.mm;

import com.oddjobs.utils.Utils;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue(value= Utils.PROVIDER.Values.FLUTTER_WAVE)
public class FlutterWaveTransaction extends  MMTransaction{
    private String redirectUrl;
    private String reference;
}
