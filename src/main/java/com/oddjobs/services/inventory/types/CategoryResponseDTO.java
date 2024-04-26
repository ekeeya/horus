package com.oddjobs.services.inventory.types;
import com.oddjobs.entities.inventory.Category;
import lombok.Data;

import java.io.Serializable;

@Data
// @JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryResponseDTO  implements Serializable {
    Long id;
    String name;
    String icon;
    Category.ICON_PROVIDER provider;
    String image;
    private Integer frequency;

    public CategoryResponseDTO(Category category){
        id=category.getId();
        name=category.getName();
        icon =  category.getIcon();
        provider=category.getProvider();
        image =  category.getImage();
        frequency=category.getFrequency();
    }
}
