package com.oddjobs.repositories.students;

import com.oddjobs.entities.CardEntity;
import com.oddjobs.entities.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CardRepository extends JpaRepository<CardEntity, Long> {

    CardEntity findCardEntityByCardNo(String cardNo);
    CardEntity findCardEntityByStudent(StudentEntity student);
}
