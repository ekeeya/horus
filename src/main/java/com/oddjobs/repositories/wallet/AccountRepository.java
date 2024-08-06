package com.oddjobs.repositories.wallet;

import com.oddjobs.entities.wallets.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<AccountEntity, Long> {
}
