package com.oddjobs.services.inventory.types;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BulkInventoryItemRequestDTO {

    @CsvBindByName(column = "name", required = true)
    private String name;

    @CsvBindByName(column = "category", required = true)
    private String category;

    @CsvBindByName(column = "price", required = true)
    private Double price;
    @CsvBindByName(column = "pos_id")
    private Long posId;

    @CsvBindByName(column = "quantity", required = true)
    private Integer quantity;

    public BulkInventoryItemRequestDTO() {
    }


}
