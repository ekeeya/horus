package com.oddjobs.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Table(name="student")
@Entity
@Setter
@Getter
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version", "createdAt","createdBy","lastModifiedAt", "lastModifiedBy","deleted","enabled"})
public class StudentEntity extends BaseEntity{

    @Column(columnDefinition = "TEXT")
    private String image; // base64 string
    private String firstName;
    private String lastName;
    private String middleName;
    @Column(unique = true)
    private String regNo= UUID.randomUUID().toString();

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="class_room_id")
    private ClassRoom classRoom;

    @OneToOne(mappedBy = "student")
    private StudentWalletAccount walletAccount;

    @ManyToOne
    @JoinColumn(name="primary_parent")
    private ParentUser primaryParent;

    @ManyToMany
    @JoinTable(name = "student_parents", joinColumns = @JoinColumn(name = "parent_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "student_id", referencedColumnName = "id"))
    private List<ParentUser> parents;

    @ManyToOne
    @JoinColumn(name="school_id", nullable=false, referencedColumnName = "id")
    private School school;


    @Transient
    public String fullName(){
        return String.format("%s %s %s", firstName, middleName, lastName);
    }
    @Override
    public String toString() {
        return "StudentEntity{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", middleName='" + middleName + '\'' +
                ", regNo='" + regNo + '\'' +
                ", School='" + school.getName() + '\'' +
                ", classRoom=" + classRoom +
                '}';
    }
}
