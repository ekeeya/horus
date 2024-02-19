package com.oddjobs.dtos.flutterwave.response;

import lombok.Data;
import org.modelmapper.ModelMapper;

import java.io.Serial;
import java.io.Serializable;
import java.util.Map;

@Data
public class FlutterwaveResponseDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 2925352260841507975L;
    private String status;
    private String message;
    private Meta meta;

    public void setMeta(Map<String, Object> metaMap) {
        ModelMapper modelMapper = new ModelMapper();
        this.meta = modelMapper.map(metaMap, Meta.class);
    }
}
