package com.oddjobs.dtos.responses;

import com.oddjobs.entities.ClassRoom;
import com.oddjobs.entities.School;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Data
@Slf4j
public class SchoolShortResponseDTO implements Serializable {
    private Long id;
    private String name;
    private String primaryContact;
    private String address;
    private String status;
    private String alias;
    private Long accountId;
    private Double accountBalance  = 0.0 ;
    private Double commissionRate= 0.0;

    public SchoolShortResponseDTO(School school){
        setName(school.getName());
        setId(school.getId());
        setAlias(school.getAlias());
        setAddress(school.getAddress());
        setPrimaryContact(school.getPrimaryContact());
        setCommissionRate(school.getCommissionRate());
        setStatus(school.getEnabled() ? "Active" : "In Active");
    }
}
