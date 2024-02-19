/*
 * Online auctioning system
 *
 * Copyright (c) 2023.  Oddjobs an alias for the author of this software. - www.skycastleauctionhub.com
 *
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@oddjobs.tech <ekeeya@oddjobs.tech>.
 *
 * This program is not free software.
 *
 * NOTICE: All information contained herein is, and remains the property of Oddjobs. - www.oddjobs.tech
 */

package com.oddjobs.dtos.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class BaseResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 2925352260841507975L;
    private boolean success;

    private String message;

    private Integer statusCode;

    private  Object data;

    public BaseResponse() {
        this.success = true;
        this.message = "success";
        this.statusCode = 200;
    }
    public BaseResponse(Exception e){
        setSuccess(false);
        setMessage(e.getMessage());
        setStatusCode(500);
    }

    public BaseResponse(BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            List<ObjectError> errors = bindingResult.getAllErrors();
            StringBuilder errorString = new StringBuilder();
            for (ObjectError e: errors) {
                if(e instanceof FieldError fe){
                    errorString.append("Field").append(fe.getField()).append(" ").append(fe.getDefaultMessage()).append(" ,");
                }
            }
            this.setMessage(errorString.toString());
            this.setSuccess(false);
            this.setStatusCode(HttpStatus.BAD_REQUEST.value());
        }else{
            this.setStatusCode(HttpStatus.OK.value());
            this.setSuccess(true);
        }
    }

    public BaseResponse(HttpStatus status, String message){
        this.success = false;
        this.message =  message;
        this.statusCode = status.value();
    }
}
