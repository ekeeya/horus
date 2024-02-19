package com.oddjobs.entities.wallets;

import com.oddjobs.entities.StudentEntity;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@DiscriminatorValue(value= Utils.WALLET_ACCOUNT_TYPES.Values.STUDENT)
public class StudentWalletAccount extends AccountEntity {

    @Column(unique = true)
    private String cardNo = Utils.generateCardNumber();

    private BigDecimal maximumDailyLimit= new BigDecimal(0);

    private Boolean enableDailyLimit = false;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="student", referencedColumnName = "id")
    private StudentEntity student;

    @Enumerated(EnumType.STRING)
    private  Utils.WALLET_STATUS status = Utils.WALLET_STATUS.PENDING;

    private Boolean isCardIssued = false;

    @Temporal(TemporalType.TIMESTAMP)
    private Date suspensionLiftDate;

    @Override
    public String toString() {
        return "StudentWalletAccount{" +
                "cardNo='" + cardNo + '\'' +
                ", maximumDailyLimit=" + maximumDailyLimit +
                ", enableDailyLimit=" + enableDailyLimit +
                ", status=" + status +
                '}';
    }
}
