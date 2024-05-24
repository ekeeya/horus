package com.oddjobs.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Table(name="class_room")
@Data
@Entity
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version", "createdAt","createdBy","lastModifiedAt", "lastModifiedBy","deleted","enabled","school"})
public class ClassRoom extends  BaseEntity{
    private String name;
    @ManyToOne
    @JoinColumn(name="school_id", nullable=false)
    private School school;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        ClassRoom classRoom = (ClassRoom) o;
        return getId() != null && Objects.equals(getId(), classRoom.getId());
    }
}
