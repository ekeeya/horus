package com.oddjobs.entities.inventory;

import com.oddjobs.entities.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
public class OrderItem extends BaseEntity {

    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private BigDecimal price = new BigDecimal(0);

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private Integer quantity=0;

    @Override
    public String toString() {
        return "OrderItem{" +
                "name='" + name + '\'' +
                ", category=" + category.getName() +
                ", price=" + price +
                ", order=" + order +
                ", quantity=" + quantity +
                '}';
    }
}
