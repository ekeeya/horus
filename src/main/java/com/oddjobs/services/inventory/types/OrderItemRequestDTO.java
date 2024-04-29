package com.oddjobs.services.inventory.types;
import lombok.Data;

import java.io.Serializable;

@Data
public class OrderItemRequestDTO implements Serializable {
    private Long id;
    private String name;
    private Double price;
    private Integer quantity;
    private Long categoryId;
}
