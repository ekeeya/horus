package com.oddjobs.entities;

import com.oddjobs.utils.Utils;
import com.vladmihalcea.hibernate.type.basic.PostgreSQLHStoreType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.util.HashMap;
import java.util.Map;

@Table(name="settings")
@Entity
@Setter
@Getter
public class Settings extends BaseEntity{

    @Enumerated(EnumType.STRING)
    private Utils.PROVIDER_TYPES provider= Utils.PROVIDER_TYPES.RELWORX;
    @Type(PostgreSQLHStoreType.class)
    @Column(columnDefinition = "hstore")
    private Map<String, String> configs = new HashMap<>();
}
