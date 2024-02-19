package com.oddjobs.entities.users;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.transactions.CollectionTransaction;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue(value= Utils.ACCOUNT_TYPE.Values.PARENT)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version", "createdAt","lastModifiedAt", "lastModifiedBy",
        "password","secret","authorities","accountNonExpired","accountNonLocked", "credentialsNonExpired",
        "createdBy","deleted","enabled","myStudents","students","transactions"})
@Data
public class ParentUser extends  User{

    @OneToMany(mappedBy = "sender")
    private List<CollectionTransaction> transactions;


    @ManyToMany
    @JoinTable(name = "student_parents", joinColumns = @JoinColumn(name = "student_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "parent_id", referencedColumnName = "id"))
    private List<StudentEntity> students;


    @OneToOne
    @JoinColumn(name="school_id")
    private School school; // let's track these parents as they are created.not mandatory but...

    @Override
    public String toString() {
        return super.toString();
    }
}
