package com.oddjobs.dtos.responses;

import com.oddjobs.entities.mm.APIUser;
import com.oddjobs.utils.Utils;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Data
public class ApiUserResponseDTO implements Serializable {
    private Long id;
    private Utils.PROVIDER provider;
    private Utils.ENV environment;

    @Getter
    @Setter
    public  class Product{
        private String name;
        private Utils.PRODUCT_TYPE productType;
        private String callBackUrl;
    }
    private Product product;

    public  ApiUserResponseDTO(APIUser u){
        this.setEnvironment(u.getEnvironment());
        this.setId(u.getId());
        this.setProvider(u.getProvider());
        Product p =  new Product();
        p.setName(u.getProduct().getName());
        p.setProductType(u.getProduct().getProductType());
        p.setCallBackUrl(u.getProduct().getCallBackUrl());
        this.setProduct(p);
    }
}
