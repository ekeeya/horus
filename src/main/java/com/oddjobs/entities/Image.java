package com.oddjobs.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="images")
@Getter
@Setter
public class Image extends BaseEntity{

    private String name;

    @Column(name="content", columnDefinition = "TEXT")
    private String content;

    @Column(name="file_type")
    private String fileType;
}
