package com.oddjobs.entities.mm.relworx;

import com.oddjobs.entities.mm.APIUser;
import com.oddjobs.utils.Utils;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@DiscriminatorValue(value= Utils.PROVIDER.Values.RELWORX)
public class RelworxUser extends APIUser {
}
