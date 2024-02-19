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

package com.oddjobs.services.admin;

import com.oddjobs.dtos.requests.SchoolRequestDTO;
import com.oddjobs.dtos.requests.StudentRequestDTO;
import com.oddjobs.entities.School;

import java.util.List;

public interface AdministrativeService {
    School registerNewSchool(SchoolRequestDTO request);
    void bulkyLoadStudents(List<StudentRequestDTO> students);
    void disableEnableSchoolAccount(School school, boolean enable);
}
