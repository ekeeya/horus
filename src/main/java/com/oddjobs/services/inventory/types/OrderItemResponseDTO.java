package com.oddjobs.services.inventory.types;
import com.oddjobs.entities.inventory.OrderItem;
import lombok.Data;

import java.io.Serializable;

@Data
public class OrderItemResponseDTO implements Serializable {
    private Long id;
    private String name;
    private Double price;
    private Integer quantity;
    private CategoryResponseDTO category;
    private Long orderId;


    public OrderItemResponseDTO(OrderItem orderItem){
        id=orderItem.getId();
        name=orderItem.getName();
        price=orderItem.getPrice().doubleValue();
        quantity=orderItem.getQuantity();
        category =  new CategoryResponseDTO(orderItem.getCategory());
        orderId=orderItem.getOrder().getId();
    }
}
