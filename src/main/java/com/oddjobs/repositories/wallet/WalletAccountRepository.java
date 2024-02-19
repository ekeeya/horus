package com.oddjobs.repositories.wallet;

import com.oddjobs.utils.Utils;
import com.oddjobs.entities.wallets.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletAccountRepository extends JpaRepository<AccountEntity, Long> {
    AccountEntity findAccountEntityByAccountNo(String accountNo);
    AccountEntity findAccountEntityByAccountType(Utils.WALLET_ACCOUNT_TYPES type);

}
