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

package com.oddjobs.dtos.requests;

import com.oddjobs.dtos.base.BaseRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class SchoolRequestDTO extends BaseRequest {

    private  Long id; // on update
    @NotNull
    private String name;
    private String primaryContact;
    private String alias;
    Double commissionRate= 0.0;
    private String address;
    private List<String> classes;
    private UserRequestDto user;
}
