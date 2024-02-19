package com.oddjobs.dtos.requests;

import com.oddjobs.entities.mm.MobileMoneyProduct;
import com.oddjobs.utils.Utils;
import lombok.Data;

@Data
public class ApiUserConfigDTO {
    private Utils.PROVIDER provider;
    private Utils.ENV environment;
    private MobileMoneyProduct product;
    private String primaryKey;
    private String secondaryKey;
    private String clientId;
    private String clientSecretKey;
    private String accessToken;
    private int tokenExpiresIn;
}
