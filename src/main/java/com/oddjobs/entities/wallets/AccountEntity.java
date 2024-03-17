package com.oddjobs.entities.wallets;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.entities.BaseEntity;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@DiscriminatorColumn(name = "account_type")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "account")
@DynamicInsert
@DynamicUpdate
@Transactional
@JsonIgnoreProperties(ignoreUnknown = true,value = {"version", "createdAt","lastModifiedAt", "lastModifiedBy", "createdBy"})
@Setter
@Getter
public abstract class AccountEntity extends BaseEntity {

    @Column(unique = true)
    private String accountNo= UUID.randomUUID().toString();

    private String name;

    private BigDecimal balance = new BigDecimal(0);

    @Column(name = "account_type", nullable = false, insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private Utils.WALLET_ACCOUNT_TYPES accountType;
}
