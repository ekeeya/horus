package com.oddjobs.repositories.students;

import com.oddjobs.entities.ClassRoom;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.users.ParentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long> {

    @Query(value = "SELECT * FROM student WHERE (school_id=:schoolId AND class_room_id=:classRoomId) AND (LOWER(first_name) LIKE %:keyword% OR LOWER(last_name) LIKE %:keyword% OR LOWER(middle_name) LIKE %:keyword%) LIMIT 10", nativeQuery = true)
    List<StudentEntity> searchStudentsBySchoolAndClassAndName(@Param("schoolId") Long schoolId, @Param("classRoomId") Long classRoomId, @Param("keyword") String keyword);

    @Query(value = "SELECT * FROM student WHERE (LOWER(first_name) LIKE %:keyword% OR LOWER(last_name) LIKE %:keyword% OR LOWER(middle_name) LIKE %:keyword%) LIMIT 10", nativeQuery = true)
    List<StudentEntity> searchStudentsByName(@Param("keyword") String keyword);

    @Query(value = "SELECT * FROM student WHERE school_id=:schoolId AND (LOWER(first_name) LIKE %:keyword% OR LOWER(last_name) LIKE %:keyword% OR LOWER(middle_name) LIKE %:keyword%) LIMIT 10", nativeQuery = true)
    List<StudentEntity> searchStudentsBySchoolAndName(@Param("schoolId") Long schoolId, @Param("keyword") String keyword);
    Page<StudentEntity> findStudentEntitiesBySchoolAndClassRoom(School school, ClassRoom classRoom, Pageable pageable);
    List<StudentEntity> findStudentEntitiesByParentsContaining(ParentUser parent);

    Page<StudentEntity> findStudentEntitiesBySchool(School school, Pageable pageable);

    StudentEntity findStudentEntityById(Long id);
}
