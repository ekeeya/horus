package com.oddjobs.repositories.wallet;

import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentWalletAccountRepository extends JpaRepository<StudentWalletAccount, Long> {

    StudentWalletAccount findWalletAccountEntityByCardNo(String accNo);

    StudentWalletAccount findStudentWalletAccountByStudent(StudentEntity student);
    Page<StudentWalletAccount> findStudentWalletAccountsByStudent_SchoolAndIsCardIssued(School school, boolean cardIssued, Pageable pageable);

    double countAllByStudent_School(School school);
    double countAllByStudent_SchoolAndStatus(School school,  Utils.WALLET_STATUS status);
    double countAllByStatus(Utils.WALLET_STATUS status);
}

