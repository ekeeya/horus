package com.oddjobs.entities.inventory;

import com.oddjobs.entities.BaseEntity;
import com.oddjobs.entities.PosCenterEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Table(name = "inventory_item")
@Entity
@Getter
@Setter
public class InventoryItem extends BaseEntity {

    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    private BigDecimal price = new BigDecimal(0);

    @ManyToOne
    @JoinColumn(name = "pos_id", referencedColumnName = "id")
    private PosCenterEntity pos;

    private Integer quantity=0;

    private Integer frequency=0;

    @Override
    public String toString() {
        return "InventoryItems{" +
                "name='" + name + '\'' +
                ", category=" + category +
                ", price=" + price +
                ", pos=" + pos.getId() +
                ", quantity=" + quantity +
                '}';
    }
}
