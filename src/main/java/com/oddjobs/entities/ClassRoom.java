package com.oddjobs.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Table(name="class_room")
@Data
@Entity
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version", "createdAt","createdBy","lastModifiedAt", "lastModifiedBy","deleted","enabled","school"})
public class ClassRoom extends  BaseEntity{
    private String name;
    @ManyToOne
    @JoinColumn(name="school_id", nullable=false)
    private School school;
}
