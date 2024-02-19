package com.oddjobs.services.mm;

import com.oddjobs.dtos.requests.BaseRequestToPay;
import com.oddjobs.dtos.requests.MMTransactionDTO;
import com.oddjobs.dtos.requests.MobileMoneyProductConfigDTO;
import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.mm.APIUser;
import com.oddjobs.entities.mm.MobileMoneyProduct;

public interface MobileMoneyService {
    Long configureMobileMoneyInTransaction(MobileMoneyProductConfigDTO config) ;
    <T extends MobileMoneyProduct> T getProduct(Utils.PRODUCT_TYPE type, Utils.PROVIDER provider);
    <T extends MobileMoneyProduct> T getProduct(Long productId);
    <T extends APIUser> T getApiUser(MobileMoneyProduct product);
    <T extends  APIUser> T getDefaultApiUser(Utils.PROVIDER provider);
    APIUser refreshAccessToken(APIUser user) throws InstantiationException, IllegalAccessException;
    MMTransaction createMMTransaction(MMTransactionDTO data);

    Long initiateWalletTopUp(BaseRequestToPay request, Utils.ENV env);

    Utils.PROVIDER determineProvider(String msisdn) throws Exception;

    boolean isTelecom();
}
