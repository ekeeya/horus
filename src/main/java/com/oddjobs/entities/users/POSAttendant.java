package com.oddjobs.entities.users;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.School;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@DiscriminatorValue(value= Utils.ACCOUNT_TYPE.Values.POS)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version", "createdAt","lastModifiedAt", "lastModifiedBy",
        "password","secret","authorities","accountNonExpired","accountNonLocked", "credentialsNonExpired",
        "createdBy","deleted", "school"})
public class POSAttendant extends  User{

    @ManyToOne
    @JoinColumn(name="pos_id")
    private PosCenterEntity posCenter;

}
