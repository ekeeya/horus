package com.oddjobs.exceptions;

public class WrongWalletStatusException extends Exception{

    public WrongWalletStatusException(String status, String accountNo) {
        super(String.format("Wrong wallet account status for acc/No %s current status is %s", accountNo, status));
    }
}
