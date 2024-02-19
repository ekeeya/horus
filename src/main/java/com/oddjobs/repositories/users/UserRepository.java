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

import com.oddjobs.entities.School;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.users.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    boolean existsByUsername(String username);
    User findUserByEmail(String email);
    User findUserById(Long id);
    Page<User> findAll(Pageable pageable);
    Page<User> findByAccountType(Utils.ACCOUNT_TYPE accountType, Pageable pageable);

    @Query("SELECT u FROM User u WHERE (TYPE(u) = POSAttendant OR TYPE(u) = SchoolUser) AND u.school = :school")
    Page<? extends User> findUsersBySchool(@Param("school") School school, Pageable pageable);
}
