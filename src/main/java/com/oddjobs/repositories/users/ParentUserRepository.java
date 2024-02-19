package com.oddjobs.repositories.users;

import com.oddjobs.entities.School;
import com.oddjobs.entities.users.ParentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ParentUserRepository extends JpaRepository<ParentUser, Long> {


    @Query(value = "SELECT * FROM auth_user WHERE account_type='PARENT' AND (LOWER(first_name) LIKE %:keyword% OR LOWER(last_name) LIKE %:keyword% OR LOWER(middle_name) LIKE %:keyword%)", nativeQuery = true)
    Page<ParentUser> searchStudentsByName(@Param("keyword") String keyword, Pageable pageable);

    Page<ParentUser> findParentUsersBySchool(School school, Pageable pageable);
}
