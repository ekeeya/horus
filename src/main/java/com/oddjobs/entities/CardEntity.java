package com.oddjobs.entities;

import jakarta.persistence.*;
import lombok.Data;

@Table(name = "nfc_card")
@Entity
@Data
public class CardEntity extends  BaseEntity{
    @Column(name="card_no", nullable = false, unique = true)
    private String cardNo;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="student_id", nullable=false)
    private StudentEntity student;

}
