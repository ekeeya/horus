package com.oddjobs.exceptions;

public class ExceedDailyExpenditureException extends Exception{

    public ExceedDailyExpenditureException(String accountNo) {
        super(String.format("Failed Payment from account: %s with exceedDailyExpenditure.", accountNo));
    }
}
