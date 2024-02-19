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

package com.oddjobs.entities;

import com.oddjobs.entities.users.POSAttendant;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class PosCenterEntity extends  BaseEntity{

    private String name;

    @ManyToOne
    @JoinColumn(name="school_id", nullable=false)
    private School school;

    @OneToMany(mappedBy = "posCenter")
    private List<POSAttendant> attendants;

    @Override
    public String toString() {
        return "PosCenterEntity{" +
                "name='" + name + '\'' +
                '}';
    }
}
