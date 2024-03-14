package com.oddjobs.entities.transactions;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.SchoolWalletAccount;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue(value= Utils.TRANSACTION_TYPE.Values.DISBURSEMENT)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version",
        "createdAt","createdBy","lastModifiedAt",
        "lastModifiedBy","deleted","enabled", "receiver"})
public class WithDrawTransaction extends  Transaction{

    @ManyToOne
    private SchoolWalletAccount creditAccount;

    @ManyToOne
    private AccountEntity debitAccount;

    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name = "request_id", referencedColumnName = "id")
    private WithdrawRequest request;

    @Override
    public String toString() {
        return "WithDrawTransaction{" +
                "creditAccount=" + creditAccount.getAccountNo() +
                ", debitAccount=" + debitAccount.getAccountNo() +
                ", amount=" + this.getAmount() +
                ", request=" + request.getId() +
                '}';
    }
}
