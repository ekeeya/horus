
package com.oddjobs.repositories.mm;

import com.oddjobs.utils.Utils;
import com.oddjobs.entities.mm.MobileMoneyProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MMProductRepository extends JpaRepository<MobileMoneyProduct, Long> {
    MobileMoneyProduct findMobileMoneyProductByProviderAndProductType(Utils.PROVIDER provider, Utils.PRODUCT_TYPE type);
}
