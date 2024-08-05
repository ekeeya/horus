package com.oddjobs.dtos.responses;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.oddjobs.entities.transactions.CollectionTransaction;
import com.oddjobs.entities.transactions.CommissionTransaction;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class TransactionResponseDTO implements Serializable {

    private String transactionId;
    private String redirectUrl;
    private Utils.TRANSACTION_STATUS status;
    private String currency;
    private Utils.TRANSACTION_NATURE nature;
    private Utils.TRANSACTION_TYPE transactionType;
    private SchoolShortResponseDTO school;
    private String description;
    private String msisdn;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER_FLOAT)
    private BigDecimal amount=new BigDecimal(0);
    private UserResponseDto sender;
    private StudentResponseDTO receiver;
    private StudentResponseDTO student;
    private AccountResponseDTO creditAccount;
    private AccountResponseDTO debitAccount;
    private POSAttendantResponseDTO posAttendant;
    private String provider;
    private Date createdAt;
    public TransactionResponseDTO(Transaction t){
        setTransactionId(t.getTransactionId());
        setStatus(t.getStatus());
        setCurrency(t.getCurrency());
        setNature(t.getNature());
        setTransactionType(t.getTransactionType());
        setSchool(new SchoolShortResponseDTO(t.getSchool()));
        setDescription(t.getDescription());
        setCreatedAt(t.getCreatedAt());
        setAmount(t.getAmount());
        if (t instanceof CommissionTransaction){
            setStudent(new StudentResponseDTO(((CommissionTransaction) t).getStudent(), false));
        }
        if(t instanceof CollectionTransaction){
            setSender(new UserResponseDto(((CollectionTransaction) t).getSender(), false));
            setReceiver(new StudentResponseDTO(((CollectionTransaction) t).getReceiver(),true));
            setCreditAccount(new AccountResponseDTO(((CollectionTransaction) t).getCreditAccount()));
            if (((CollectionTransaction) t).getMmTransaction() != null ){
                MMTransaction mmTransaction =((CollectionTransaction) t).getMmTransaction();
                setProvider(mmTransaction.getProvider().name());
                setMsisdn(((CollectionTransaction) t).getMmTransaction().getMsisdn());
            }
        }else if(t instanceof PaymentTransaction) {
            setDebitAccount(new AccountResponseDTO(((PaymentTransaction) t).getDebitAccount()));
            if (((PaymentTransaction) t).getAttendant() != null){
                setPosAttendant(new POSAttendantResponseDTO(((PaymentTransaction) t).getAttendant()));
            }

        }

    }
}
