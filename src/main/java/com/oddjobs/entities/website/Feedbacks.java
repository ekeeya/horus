package com.oddjobs.entities.website;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.entities.BaseEntity;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "feedback")
@DynamicInsert
@DynamicUpdate
@Transactional
@JsonIgnoreProperties(ignoreUnknown = true,value = {"version", "createdAt","lastModifiedAt", "lastModifiedBy", "createdBy"})
@Data
@Entity
public abstract class Feedbacks extends BaseEntity {
    private String name;
    private String comment;
    private Boolean status;
}

