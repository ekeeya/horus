package com.oddjobs.services.inventory.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.oddjobs.entities.inventory.Category;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryRequestDTO {
    private Long id; // for update
    String name;
    String icon;
    Category.ICON_PROVIDER provider;
    String image;
}
