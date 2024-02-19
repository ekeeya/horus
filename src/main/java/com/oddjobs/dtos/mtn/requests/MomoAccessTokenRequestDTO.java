package com.oddjobs.dtos.mtn.requests;

import com.oddjobs.utils.Utils;
import lombok.Data;

@Data
public class MomoAccessTokenRequestDTO {
    private String apiKey;
    private String primaryKey;
    private String userUuid;
    private Utils.PROVIDER provider;
}
