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

package com.oddjobs.entities.mm.airtel;


import com.oddjobs.entities.mm.APIUser;
import com.oddjobs.utils.Utils;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue(value= Utils.PROVIDER.Values.AIRTEL)
public class AirtelApiUser extends APIUser {

    @Column(name="client_id")
    private String clientId;

    @Column(name="client_secret_key")
    private String clientSecretKey;
}