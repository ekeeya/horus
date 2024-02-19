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

package com.oddjobs.services.students;

import com.oddjobs.dtos.requests.BulkStudentLoadRequestDTO;
import com.oddjobs.dtos.requests.StudentRequestDTO;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.exceptions.GenericException;
import com.oddjobs.exceptions.SchoolNotFoundException;
import org.springframework.data.domain.Page;

public interface StudentService {

    StudentEntity registerStudent(StudentRequestDTO request) throws SchoolNotFoundException, GenericException;
    void registerStudentViaBulk(BulkStudentLoadRequestDTO student, Long schoolId) throws Exception;
    StudentEntity findById(Long id);
    Page<StudentEntity> findBySchool(Long schoolId, int page, int size);
    Page<StudentEntity> findAll(int page, int size);
    Page<StudentEntity> findStudentBySchoolAndClass(Long schoolId, Long classRoomId, int page, int size);
    void linkStudentToParent(StudentEntity student, Long parentId, boolean editing);
}
