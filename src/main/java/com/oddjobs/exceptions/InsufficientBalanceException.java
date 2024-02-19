package com.oddjobs.exceptions;

public class InsufficientBalanceException extends Exception{

    public InsufficientBalanceException(Double balance, Double payment, String accountNo) {
        super(String.format("Failed Attempted payment of %s on account: %s  with Insufficient balance %s ", accountNo, payment, balance));
    }

    public InsufficientBalanceException(Double balance, String accountNo) {
        super(String.format("Failed withdraw of amount: %s  due to Insufficient balance at school account %s ", balance, accountNo));
    }
}
