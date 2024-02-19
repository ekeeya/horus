package com.oddjobs.entities.users;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.utils.Utils;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@DiscriminatorValue(value= Utils.ACCOUNT_TYPE.Values.ADMIN)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version", "createdAt","lastModifiedAt", "lastModifiedBy",
        "createdBy","deleted","enabled"})
public class ProspectUser extends  Prospect {

}
