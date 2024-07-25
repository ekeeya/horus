package com.oddjobs.services.schools;

import com.oddjobs.dtos.requests.ClassRoomDTO;
import com.oddjobs.dtos.requests.SchoolRequestDTO;
import com.oddjobs.entities.ClassRoom;
import com.oddjobs.entities.School;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.utils.Utils;
import org.springframework.data.domain.Page;

public interface SchoolService {
    Long register(SchoolRequestDTO request);
    School findById(Long id) throws SchoolNotFoundException;

    ClassRoom createClassRoom(ClassRoomDTO request) throws SchoolNotFoundException;

    Page<School> fetchAll(int page, int size);

    Page<School> searchByNameLike(String name, int page, int size);

    void setCommissionFee(Long schoolId, Double fee, Double schoolFee) throws SchoolNotFoundException;

    void schoolAccountManagement(Utils.ACCOUNT_ACTIONS action, Long schoolId) throws Exception;

    long countSchools();
}
