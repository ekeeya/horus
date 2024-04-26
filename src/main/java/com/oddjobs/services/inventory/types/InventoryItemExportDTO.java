package com.oddjobs.services.inventory.types;

import com.oddjobs.entities.inventory.InventoryItem;
import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InventoryItemExportDTO {
    private Long id;
    private String name;
    private Long categoryId;
    private Double price;
    private Long posId;
    private Integer quantity;
    private Integer frequency;

    public InventoryItemExportDTO(){}

    public InventoryItemExportDTO(InventoryItem inventoryItem){
            id=inventoryItem.getId();
            name=inventoryItem.getName();
            categoryId=inventoryItem.getCategory().getId();
            price=inventoryItem.getPrice().doubleValue();
            posId=inventoryItem.getPos().getId();
            quantity=inventoryItem.getQuantity();
            frequency=inventoryItem.getFrequency();
    }

}
