package com.oddjobs.entities.inventory;

import com.oddjobs.entities.BaseEntity;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Table(name = "orders")
@Entity
@Getter
@Setter
public class Order extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "wallet_id", referencedColumnName = "id")
    private StudentWalletAccount wallet;

    private BigDecimal amount=new BigDecimal(0);

    public enum STATUS{
        Pending, Processed, Cancelled, Failed
    }
    @Enumerated(EnumType.STRING)
    private STATUS status =  STATUS.Pending;

    @ManyToOne
    @JoinColumn(name = "pos_id", referencedColumnName = "id")
    private PosCenterEntity pos;

    @OneToMany(mappedBy = "order")
    private List<OrderItem> items;
}
