/*
 * Online auctioning system
 *
 * Copyright (c) 2023.  Oddjobs an alias for the author of this software. - www.skycastleauctionhub.com
 *
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@oddjobs.tech <ekeeya@oddjobs.tech>.
 *
 * This program is not free software.
 *
 * NOTICE: All information contained herein is, and remains the property of Oddjobs. - www.oddjobs.tech
 */

package com.oddjobs.repositories.wallet;

import com.oddjobs.entities.School;
import com.oddjobs.entities.wallets.SchoolCollectionAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolCollectionAccountRepository extends JpaRepository<SchoolCollectionAccount, Long> {
    SchoolCollectionAccount findSchoolWalletAccountBySchool(School school);
}
