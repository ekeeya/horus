package com.oddjobs.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;


@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version", "createdAt","createdBy","lastModifiedAt", "lastModifiedBy","deleted","enabled", "commissionRate"})
public class School extends  BaseEntity{

    @Column(unique = true)
    private String name;
    private String primaryContact;
    private String alias;
    private String address;
    @Column(name="commission_rate")
    private Double commissionRate = 0.0;
    @OneToMany(mappedBy = "school")
    private List<ClassRoom> classes;

    @Override
    public String toString() {
        return "School{" +
                "name='" + name + '\'' +
                ", primaryContact='" + primaryContact + '\'' +
                ", address='" + address + '\'' +
                ", commissionRate=" + commissionRate +
                '}';
    }
}
