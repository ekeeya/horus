package com.oddjobs.exceptions;

public class WalletAccountNotFoundException extends Exception{

    public WalletAccountNotFoundException() {
        super("No Wallet account found in the database");
    }

    public WalletAccountNotFoundException(String message) {
        super(message);
    }
}
