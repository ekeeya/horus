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

package com.oddjobs.entities.mm.mtn;

import com.oddjobs.entities.mm.APIUser;
import com.oddjobs.utils.Utils;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@DiscriminatorValue(value= Utils.PROVIDER.Values.MTN)
public class MTNApiUser extends APIUser {
    @Column(name="primary_key")
    private String primaryKey;

    @Column(name="secondary_key")
    private String secondaryKey;

    @Column(name="api_key")
    private  String apiKey;

    @Column(name="user_uuid")
    private String userUuid;
}
