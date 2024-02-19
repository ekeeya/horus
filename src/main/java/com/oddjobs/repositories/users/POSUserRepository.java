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

package com.oddjobs.repositories.users;

import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.School;
import com.oddjobs.entities.users.POSAttendant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface POSUserRepository extends JpaRepository<POSAttendant, Long> {

    Page<POSAttendant> findAllByPosCenter_School(School school, Pageable pageable);
    Page<POSAttendant> findAllByPosCenter(PosCenterEntity posCenter, Pageable pageable);
    int countAllByPosCenter_School(School school);
}
