package com.oddjobs.repositories.school;

import com.oddjobs.entities.ClassRoom;
import com.oddjobs.entities.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {

    List<ClassRoom> findClassRoomsBySchoolOrderByNameDesc(School school);

    boolean existsClassRoomByNameAndSchool(String name, School school);

    ClassRoom findClassRoomByNameAndSchool(String name, School school);
}
