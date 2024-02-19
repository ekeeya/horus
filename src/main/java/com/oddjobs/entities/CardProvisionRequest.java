package com.oddjobs.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "card_provision_request")
@Entity
@Getter
@Setter
public class CardProvisionRequest extends BaseEntity{

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="student_id", nullable=false)
    private StudentEntity student;

    private Boolean provisioned = false;

}
