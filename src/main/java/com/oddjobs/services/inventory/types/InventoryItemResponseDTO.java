package com.oddjobs.services.inventory.types;
import com.oddjobs.dtos.responses.SimplePosCenter;
import com.oddjobs.entities.inventory.InventoryItem;
import lombok.Data;

@Data
public class InventoryItemResponseDTO {
    private Long id;
    private String name;
    private Double price;
    private Integer quantity;
    private Integer frequency;
    private CategoryResponseDTO category;
    private SimplePosCenter pos;

    public InventoryItemResponseDTO(InventoryItem inventoryItem){
        id=inventoryItem.getId();
        name=inventoryItem.getName();
        price =inventoryItem.getPrice().doubleValue();
        quantity = inventoryItem.getQuantity();
        frequency=inventoryItem.getFrequency();
        category = new CategoryResponseDTO(inventoryItem.getCategory());
        pos = new SimplePosCenter(inventoryItem.getPos());
    }
}
