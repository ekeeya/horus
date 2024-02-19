package com.oddjobs.dtos.requests;

import com.oddjobs.utils.Utils;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MobileMoneyProductConfigDTO{

    @NotNull
    private String name;
    @NotNull
    private Utils.PRODUCT_TYPE productType;
    @NotNull
    private Utils.PROVIDER provider;
    @NotNull
    private String callBackUrl;
    private String description;
    private String hashKey;
    private String primaryKey;
    private String secondaryKey;
    private String clientId;
    private String username;
    private String password;
    private String clientSecretKey;
    @NotNull
    private Utils.ENV environment;
    private String publicKey;
    private String secretKey;
    private String encryptionKey;
}
