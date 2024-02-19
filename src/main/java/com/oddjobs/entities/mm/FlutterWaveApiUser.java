package com.oddjobs.entities.mm;

import com.oddjobs.utils.Utils;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue(value= Utils.PROVIDER.Values.FLUTTER_WAVE)
public class FlutterWaveApiUser extends APIUser{
    private String publicKey;
    private String secretKey;
    private String encryptionKey;
}
