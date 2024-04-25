package com.oddjobs.services.inventory.types;

import lombok.Data;
@Data
public class InventoryItemRequestDTO {
    private Long id; // for update
    private String name;
    private Long categoryId;
    private Double price;
    private Long posId;
    private Integer quantity;
    private Integer frequency;
}
