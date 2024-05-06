package com.oddjobs.services.inventory.types;
import com.oddjobs.entities.inventory.OrderItem;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class OrderItemResponseDTO implements Serializable {
    private Long id;
    private String name;
    private Double price;
    private Integer quantity;
    private CategoryResponseDTO category;
    private Long orderId;
    private String posName;
    private String attendant;
    private Date createdAt;


    public OrderItemResponseDTO(OrderItem orderItem){
        id=orderItem.getId();
        name=orderItem.getName();
        price=orderItem.getPrice().doubleValue();
        quantity=orderItem.getQuantity();
        posName =  orderItem.getOrder().getPos().getName();
        attendant  =  orderItem.getOrder().getCreatedBy();
        category =  new CategoryResponseDTO(orderItem.getCategory());
        orderId=orderItem.getOrder().getId();
        createdAt= orderItem.getCreatedAt();
    }
}
