package com.oddjobs.services.inventory.types;
import com.oddjobs.entities.inventory.Category;
import com.opencsv.bean.CsvBindByName;
import lombok.Data;

@Data
public class BulkCategoryRequestDTO {
    @CsvBindByName(column = "name", required = true)
    String name;
    @CsvBindByName(column = "icon", required = true)
    String icon;
    @CsvBindByName(column = "provider", required = true)
    Category.ICON_PROVIDER provider;

    @CsvBindByName(column = "image", required = true)
    String image;

    public BulkCategoryRequestDTO(){}

    public BulkCategoryRequestDTO(String name, String icon, Category.ICON_PROVIDER provider, String image) {
        this.name = name;
        this.icon = icon;
        this.provider = provider;
        this.image = image;
    }
}
