package com.oddjobs.repositories.wallet;

import com.oddjobs.entities.School;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.wallets.AccountEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface WalletAccountRepository extends JpaRepository<AccountEntity, Long> {
    AccountEntity findAccountEntityByAccountNo(String accountNo);
    AccountEntity findAccountEntityByAccountType(Utils.WALLET_ACCOUNT_TYPES type);

    List<AccountEntity> findAccountEntitiesByAccountTypeIn(List<Utils.WALLET_ACCOUNT_TYPES> types);

    @Query("SELECT t FROM AccountEntity t WHERE  t.school = :school")
    List<? extends AccountEntity> findAccountsBySchool(@Param("school") School school);

}
