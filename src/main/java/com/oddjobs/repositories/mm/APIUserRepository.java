package com.oddjobs.repositories.mm;

import com.oddjobs.utils.Utils;
import com.oddjobs.entities.mm.APIUser;
import com.oddjobs.entities.mm.MobileMoneyProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface APIUserRepository extends JpaRepository<APIUser, Long> {
    APIUser findAPIUserByProductAndProvider(MobileMoneyProduct product, Utils.PROVIDER provider);
    APIUser findAPIUserByProduct_ProductTypeAndProvider(Utils.PRODUCT_TYPE type, Utils.PROVIDER provider);
}
