package com.oddjobs.services.inventory.types;
import com.oddjobs.entities.inventory.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BulkCategoryRequestDTO {
    String name;
    String icon;
    Category.ICON_PROVIDER provider;
    String image;

    public BulkCategoryRequestDTO(){}
}
