package com.oddjobs.dtos.responses;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.SchoolCollectionAccount;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.utils.Utils;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class AccountResponseDTO implements Serializable {

    private String accountNo;
    private String name;
    private String cardNo;
    private BigDecimal maximumDailyLimit;
    private Boolean enableDailyLimit;
    private BigDecimal balance;
    private Utils.WALLET_ACCOUNT_TYPES accountType;
    private Long studentId;
    private Long schoolId;
    private String  SchoolName;
    private String student;
    private String className;
    private Date createdAt;
    // private SchoolResponseDTO school;
    public AccountResponseDTO(AccountEntity account){
        setAccountNo(account.getAccountNo());
        setName(account.getName());
        if(account instanceof StudentWalletAccount){
            setCardNo(((StudentWalletAccount) account).getCardNo());
            setMaximumDailyLimit(((StudentWalletAccount) account).getMaximumDailyLimit());
            setEnableDailyLimit(((StudentWalletAccount) account).getEnableDailyLimit());
            setStudentId(((StudentWalletAccount) account).getStudent().getId());
            setStudent(((StudentWalletAccount) account).getStudent().fullName());
            setClassName(((StudentWalletAccount) account).getStudent().getClassRoom().getName());
            setSchoolId(((StudentWalletAccount) account).getStudent().getSchool().getId());
            setSchoolName(((StudentWalletAccount) account).getStudent().getSchool().getName());
        } else if (account instanceof SchoolCollectionAccount){
            setSchoolName(((SchoolCollectionAccount) account).getSchool().getName());
            setSchoolId(((SchoolCollectionAccount) account).getSchool().getId());
        }
        setCreatedAt(account.getCreatedAt());
        setAccountType(account.getAccountType());
        setBalance(account.getBalance());
    }
}