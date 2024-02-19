package com.oddjobs.exceptions;

import com.oddjobs.entities.wallets.StudentWalletAccount;

public class InActiveCardException extends  Exception{
    public InActiveCardException(StudentWalletAccount walletAccount) {
        super(String.format("Card no. %s is not in Active state: It is currently %s", walletAccount.getCardNo(), walletAccount.getStatus().toString()));
    }
}
