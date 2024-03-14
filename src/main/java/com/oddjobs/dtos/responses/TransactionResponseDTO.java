package com.oddjobs.dtos.responses;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.oddjobs.entities.transactions.CollectionTransaction;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.transactions.mm.FlutterWaveTransaction;
import com.oddjobs.entities.transactions.mm.MMTransaction;
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
    private SchoolResponseDTO school;
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER_FLOAT)
    private BigDecimal amount=new BigDecimal(0);
    private UserResponseDto sender;
    private StudentResponseDTO receiver;
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
        setSchool(new SchoolResponseDTO(t.getSchool()));
        setDescription(t.getDescription());
        setCreatedAt(t.getCreatedAt());
        setAmount(t.getAmount());
        if(t instanceof CollectionTransaction){
            setSender(new UserResponseDto(((CollectionTransaction) t).getSender()));
            setReceiver(new StudentResponseDTO(((CollectionTransaction) t).getReceiver(),true));
            setCreditAccount(new AccountResponseDTO(((CollectionTransaction) t).getCreditAccount()));
            if (((CollectionTransaction) t).getMmTransaction() != null ){
                MMTransaction mmTransaction =((CollectionTransaction) t).getMmTransaction();
                setProvider(mmTransaction.getProvider().name());

                if(mmTransaction instanceof FlutterWaveTransaction){
                    setRedirectUrl(((FlutterWaveTransaction) mmTransaction).getRedirectUrl());
                }
            }
        }else if(t instanceof PaymentTransaction) {
            setDebitAccount(new AccountResponseDTO(((PaymentTransaction) t).getDebitAccount()));
            setPosAttendant(new POSAttendantResponseDTO(((PaymentTransaction) t).getAttendant()));
        }

    }
}
