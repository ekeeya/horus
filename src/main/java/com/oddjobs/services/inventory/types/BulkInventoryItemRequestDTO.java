package com.oddjobs.services.inventory.types;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BulkInventoryItemRequestDTO {
    private String name;

    @CsvBindByName(column = "category", required = true)
    private String category;
    private Double price;

    @CsvBindByName(column = "pos_id", required = true)
    private Long posId;
    private Integer quantity;
    public BulkInventoryItemRequestDTO(){}

}
