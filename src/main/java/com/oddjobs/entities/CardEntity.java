package com.oddjobs.entities;

import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import lombok.Data;

@Table(name = "nfc_card")
@Entity
@Data
public class CardEntity extends  BaseEntity{
    @Column(name="card_no", nullable = false, unique = true)
    private String cardNo = Utils.generateCardNumber();
    private String serialNo;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="student_id", nullable=false)
    private StudentEntity student;

}
