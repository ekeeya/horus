package com.oddjobs.exceptions;

public class TransactionDoesNotExistException extends  Exception{
    public TransactionDoesNotExistException(Object  txRefOrtxId) {
        super(String.format("Transaction with reference or transaction Id %s does not exist", txRefOrtxId));
    }
}
