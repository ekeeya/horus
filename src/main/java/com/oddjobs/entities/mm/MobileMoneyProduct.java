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

package com.oddjobs.entities.mm;

import com.oddjobs.entities.BaseEntity;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;


@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorColumn(name = "provider")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DynamicInsert
@DynamicUpdate
@Transactional
@Data
@Table(name="mm_product")
public abstract class MobileMoneyProduct extends BaseEntity {

    private String name;

    @Enumerated(EnumType.STRING)
    private Utils.PRODUCT_TYPE productType= Utils.PRODUCT_TYPE.COLLECTIONS;

    @Column(insertable=false, updatable = false, nullable = false)
    @Enumerated(EnumType.STRING)
    private Utils.PROVIDER provider;

    @Column(name="call_back_url")
    private String callBackUrl;

}
