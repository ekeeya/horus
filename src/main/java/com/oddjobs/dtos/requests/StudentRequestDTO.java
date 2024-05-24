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
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class StudentRequestDTO extends BaseRequest {
    private Long id;
    private String image;
    private String firstName;
    private String lastName;
    private String middleName;
    private String regNo;
    private Long school;
    private Long parent;
    private Boolean editing=false;

    public StudentRequestDTO(){};

    public StudentRequestDTO(Long id,String image, String firstName, String lastName, String middleName, String regNo,Long school, Long parent, Boolean editing) {
        this.id=id;
        this.image = image;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.regNo = regNo;
        this.school = school;
        this.parent=parent;
        this.editing=editing;
    }
}
