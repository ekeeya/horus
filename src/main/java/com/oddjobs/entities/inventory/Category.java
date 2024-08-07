package com.oddjobs.entities.inventory;

import com.oddjobs.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "categories")
@Entity
@Getter
@Setter
public class Category extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String icon;

    private Integer frequency=0;

    public static enum ICON_PROVIDER{
        AntDesign, Entypo, EvilIcons, Feather, FontAwesome,FontAwesome5, FontAwesome6,SimpleLineIcons,Octicons,
        FontAwesome5Brands, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons, Zocial
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ICON_PROVIDER provider;

    private String image;

    @Override
    public String toString() {
        return "Category{" +
                "name='" + name + '\'' +
                ", icon='" + icon + '\'' +
                ", provider=" + provider +
                '}';
    }
}
