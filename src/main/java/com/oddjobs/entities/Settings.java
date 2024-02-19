package com.oddjobs.entities;

import com.oddjobs.utils.Utils;
import com.vladmihalcea.hibernate.type.basic.PostgreSQLHStoreType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

import java.util.HashMap;
import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Table(name="settings")
@Entity
@Data
public class Settings extends BaseEntity{


    @Enumerated(EnumType.STRING)
    private Utils.PROVIDER_TYPES provider= Utils.PROVIDER_TYPES.EASY_PAY;
    @Type(PostgreSQLHStoreType.class)
    @Column(columnDefinition = "hstore")
    private Map<String, String> configs = new HashMap<>();
}
