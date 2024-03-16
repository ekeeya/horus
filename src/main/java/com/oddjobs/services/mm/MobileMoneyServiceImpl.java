
package com.oddjobs.services.mm;


import com.oddjobs.dtos.airtel.requests.AirtelAccessTokenRequestDTO;
import com.oddjobs.dtos.airtel.requests.AirtelPaymentRequestDTO;
import com.oddjobs.dtos.airtel.requests.AirtelRequestToPayDTO;
import com.oddjobs.dtos.airtel.responses.PaymentResponseDTO;
import com.oddjobs.dtos.mtn.requests.MomoAccessTokenRequestDTO;
import com.oddjobs.dtos.mtn.requests.MomoRequestToPayDTO;
import com.oddjobs.dtos.mtn.responses.APIkeyResponseDTO;
import com.oddjobs.dtos.mtn.responses.EmptyResponseDTO;
import com.oddjobs.dtos.relworx.requests.RelworxPaymentRequestDTO;
import com.oddjobs.dtos.relworx.requests.RelworxRequestToPayDTO;
import com.oddjobs.dtos.relworx.response.RelworxPaymentResponseDTO;
import com.oddjobs.dtos.requests.BaseRequestToPay;
import com.oddjobs.dtos.requests.MMTransactionDTO;
import com.oddjobs.dtos.requests.MobileMoneyProductConfigDTO;
import com.oddjobs.entities.mm.*;
import com.oddjobs.entities.mm.airtel.AirtelApiUser;
import com.oddjobs.entities.mm.airtel.AirtelProduct;
import com.oddjobs.entities.mm.mtn.MTNApiUser;
import com.oddjobs.entities.mm.mtn.MTNProduct;
import com.oddjobs.entities.mm.relworx.RelworxProduct;
import com.oddjobs.entities.mm.relworx.RelworxUser;
import com.oddjobs.entities.transactions.mm.*;
import com.oddjobs.entities.transactions.mm.airtel.AirtelTransaction;
import com.oddjobs.entities.transactions.mm.mtn.MTNTransaction;
import com.oddjobs.entities.transactions.mm.relworx.RelworxTransaction;
import com.oddjobs.repositories.mm.APIUserRepository;
import com.oddjobs.repositories.mm.MMProductRepository;
import com.oddjobs.repositories.mm.MMTransactionRepository;
import com.oddjobs.services.CustomRunnable;
import com.oddjobs.services.IdentifiableRunnable;
import com.oddjobs.services.TransactionalExecutorService;
import com.oddjobs.services.external.ExternalRequests;
import com.oddjobs.utils.Utils;
import com.oddjobs.dtos.responses.AccessTokenResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MobileMoneyServiceImpl implements MobileMoneyService {

    private final MMProductRepository mmProductRepository;
    private final APIUserRepository apiUserRepository;
    private final ExternalRequests externalRequests;
    private final MMTransactionRepository mmTransactionRepository;
    private final TransactionalExecutorService executorService;

    @Value("${mm.api.airtelPrefixes}")
    private List<String> airtelPrefixes;

    @Value("${mm.api.mtnPrefixes}")
    private List<String> mtnPrefixes;

    @Value("${mm.api.provider.type}")
    private String mmProviderType;



    @Override
    public Long configureMobileMoneyInTransaction(MobileMoneyProductConfigDTO config) {

        Function<Long, Long> future = x -> {
            MobileMoneyProduct product= mmProductRepository.findMobileMoneyProductByProviderAndProductType(config.getProvider(), config.getProductType());;
            APIUser apiUser = apiUserRepository.findAPIUserByProduct_ProductTypeAndProvider(config.getProductType(), config.getProvider());
            if (config.getProvider().equals(Utils.PROVIDER.MTN)) {
                //  configure and return for MTN
                if(product == null){
                 product =  new MTNProduct();
                }
                ((MTNProduct) product).setDescription(config.getDescription());
            } else if(config.getProvider().equals(Utils.PROVIDER.AIRTEL))  {
                if(product == null){
                    product = new AirtelProduct();
                }
                ((AirtelProduct) product).setHashKey(config.getHashKey());
            }
            else{
                // For relworx we only need one product
                if(product == null){
                    product = new RelworxProduct();
                }
            }
            product.setProductType(config.getProductType());
            product.setName(config.getName());
            product.setProvider(config.getProvider());
            product.setCallBackUrl(config.getCallBackUrl());
            mmProductRepository.save(product);
            // create User
            try {
                AccessTokenResponseDTO response;
                switch (product.getProvider()) {
                    case MTN -> {
                        String userUuid = externalRequests.sendCreateMomoAPIUser(config.getPrimaryKey(), config.getCallBackUrl());
                        APIkeyResponseDTO apiKeyResponse = externalRequests.generateMomoAPIKey(userUuid, config.getPrimaryKey());
                        apiUser =  apiUser == null ? new MTNApiUser() : apiUser;
                        ((MTNApiUser) apiUser).setApiKey(apiKeyResponse.getApiKey());
                        ((MTNApiUser) apiUser).setUserUuid(userUuid);
                        ((MTNApiUser) apiUser).setPrimaryKey(config.getPrimaryKey());
                        ((MTNApiUser) apiUser).setSecondaryKey(config.getSecondaryKey());
                        // We might as well get he accessToken
                        MomoAccessTokenRequestDTO momoAccessTokenRequestDTO = new MomoAccessTokenRequestDTO();
                        momoAccessTokenRequestDTO.setProvider(config.getProvider());
                        momoAccessTokenRequestDTO.setPrimaryKey(config.getPrimaryKey());
                        momoAccessTokenRequestDTO.setApiKey(apiKeyResponse.getApiKey());
                        momoAccessTokenRequestDTO.setUserUuid(userUuid);
                        apiUser.setAccessTokenAdded(Calendar.getInstance().getTime());
                        response = externalRequests.generateMomoAccessToken(momoAccessTokenRequestDTO);
                        apiUser.setAccessToken(response.getAccess_token());
                        apiUser.setAccessTokenExpiresIn(response.getExpires_in());
                    }
                    case AIRTEL -> {
                        apiUser  =  apiUser == null ? new AirtelApiUser() : apiUser;
                        apiUser.setAccessTokenAdded(Calendar.getInstance().getTime());
                        AirtelAccessTokenRequestDTO accessTokenRequest = new AirtelAccessTokenRequestDTO(config.getClientId(), config.getClientSecretKey());
                        response = externalRequests.generateAirtelAccessToken(accessTokenRequest);
                        ((AirtelApiUser) apiUser).setClientId(config.getClientId());
                        ((AirtelApiUser) apiUser).setClientSecretKey(config.getClientSecretKey());
                        apiUser.setAccessToken(response.getAccess_token());
                        apiUser.setAccessTokenExpiresIn(response.getExpires_in());
                    }
                    default -> {
                        // This is RELWORX
                        apiUser = apiUser==null ? new RelworxUser(): apiUser;
                        apiUser.setAccessToken(config.getApiKey());
                    }
                }
                apiUser.setEnvironment(config.getEnvironment());
                apiUser.setProvider(config.getProvider());
                apiUser.setProduct(product);
                APIUser newUser = apiUserRepository.save(apiUser);
                return newUser.getId();
            } catch (InstantiationException | IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        };
        IdentifiableRunnable customRunnable = new CustomRunnable(future);
        return executorService.executeInTransaction(customRunnable);
    }

    @Override
    public <T extends MobileMoneyProduct> T getProduct(Utils.PRODUCT_TYPE type, Utils.PROVIDER provider) {
        return (T) mmProductRepository.findMobileMoneyProductByProviderAndProductType(provider, type);
    }

    @Override
    public <T extends MobileMoneyProduct> T getProduct(Long productId) {
        try {
            MobileMoneyProduct p = mmProductRepository.findById(productId).get();
            return (T) p;
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException("No such Mobile money product with id: " + productId);
        }
    }

    @Override
    public <T extends APIUser> T getApiUser(MobileMoneyProduct product) {
        return (T) apiUserRepository.findAPIUserByProductAndProvider(product, product.getProvider());
    }

    @Override
    public <T extends APIUser> T getDefaultApiUser(Utils.PROVIDER provider) {
        return (T) apiUserRepository.findAPIUserByProduct_ProductTypeAndProvider(Utils.PRODUCT_TYPE.COLLECTIONS, provider);
    }


    @Override
    public APIUser refreshAccessToken(APIUser user) throws InstantiationException, IllegalAccessException {
        List<Utils.PROVIDER> providersNotForRefreshTokens = List.of(Utils.PROVIDER.RELWORX);
        if(!providersNotForRefreshTokens.contains(user.getProvider())){
            Calendar tokenCreationDate = Calendar.getInstance();
            tokenCreationDate.setTime(user.getAccessTokenAdded());
            tokenCreationDate.add(Calendar.SECOND, (user.getAccessTokenExpiresIn() + 30));// let's add in more 30s
            Date now = Calendar.getInstance().getTime();
            AccessTokenResponseDTO response;
            if (tokenCreationDate.getTime().after(now)) {
                if (user.getProvider().equals(Utils.PROVIDER.MTN)) {
                    MomoAccessTokenRequestDTO token = new MomoAccessTokenRequestDTO();
                    MTNApiUser u = (MTNApiUser) user;
                    token.setApiKey(u.getApiKey());
                    token.setProvider(Utils.PROVIDER.MTN);
                    token.setPrimaryKey(u.getPrimaryKey());
                    token.setUserUuid(u.getUserUuid());
                    response = externalRequests.generateMomoAccessToken(token);
                } else {
                    AirtelApiUser u = (AirtelApiUser) user;
                    AirtelAccessTokenRequestDTO token =  new AirtelAccessTokenRequestDTO(u.getClientId(),u.getClientSecretKey());
                    response =  externalRequests.generateAirtelAccessToken(token);
                }
                user.setAccessTokenAdded(Calendar.getInstance().getTime());

                user.setAccessToken(response.getAccess_token());
                user.setAccessTokenExpiresIn(response.getExpires_in());
                return apiUserRepository.save(user);
            }
        }
        return  user;
    }

    @Override
    public MMTransaction createMMTransaction(MMTransactionDTO data) {
        MMTransaction transaction;
        switch (data.getProvider()) {
            case MTN -> {
                transaction = new MTNTransaction();
                ((MTNTransaction) transaction).setXReferenceId(data.getXReferenceId());
            }
            case AIRTEL -> {
                transaction = new AirtelTransaction();
                ((AirtelTransaction) transaction).setResponseCode(data.getResponseCode());
            }
            default -> {
                transaction = new RelworxTransaction();
                ((RelworxTransaction) transaction).setReference(data.getReference());
                ((RelworxTransaction) transaction).setInternal_reference(data.getInternalReference());
            }
        }
        transaction.setTransactionId(data.getTransactionId());
        transaction.setTransactionType(data.getTransactionType());
        transaction.setMsisdn(data.getMsisdn());
        transaction.setAmount(data.getAmount());
        transaction.setCurrency(data.getCurrency());
        transaction.setStatus(data.getStatus());
        transaction.setDescription(data.getDescription());
        transaction.setProvider(data.getProvider());
        transaction.setProvider(data.getProvider());
        return mmTransactionRepository.save(transaction);
    }

    @Override
    public Long initiateWalletTopUp(BaseRequestToPay request, Utils.ENV env) {
        MMTransactionDTO config =  new MMTransactionDTO();
        try{
            MobileMoneyProduct product = getProduct(Utils.PRODUCT_TYPE.COLLECTIONS, request.getProvider());
            APIUser apiUser = refreshAccessToken(getApiUser(product));
            switch (request.getProvider()){
                case MTN -> {
                    String currency = env.equals(Utils.ENV.SANDBOX) ? "EUR" : "UGX";
                    MomoRequestToPayDTO req = (MomoRequestToPayDTO) request;
                    req.setExternalId(config.getXReferenceId());
                    String payerMessage = String.format("Deposit UGX:%s to School Cashless", request.getAmount());
                    String payeeNote = String.format("Receive an deposit of UGX:%s from %s", request.getAmount(), ((MomoRequestToPayDTO) request).getPayer().getPartyId());
                    req.setPayeeNote(payeeNote);
                    req.setPayerMessage(payerMessage);
                    req.setCurrency(currency);
                    MTNApiUser mtnApiUser = (MTNApiUser)apiUser;
                    // let's make the request but before.
                    EmptyResponseDTO response = externalRequests.momoRequestToPay(req, mtnApiUser);
                    log.info(response.toString());
                    config.setMsisdn(req.getPayer().getPartyId());
                    config.setXReferenceId(response.getXReferenceId());
                }
                case AIRTEL -> {
                    AirtelRequestToPayDTO r = (AirtelRequestToPayDTO) request;
                    String reference = String.format("Initiate payment of %s for from %s", request.getAmount(), r.getMsisdn());
                    AirtelPaymentRequestDTO req = new AirtelPaymentRequestDTO(
                            r.getMsisdn(),
                            request.getAmount(),
                            config.getReference(),
                            reference);
                    AirtelApiUser airtelApiUser =  (AirtelApiUser) apiUser;
                    PaymentResponseDTO response =  externalRequests.airtelInitiatePayment(airtelApiUser, req);
                    log.info(response.toString());
                    config.setResponseCode(response.getData().get("transaction").get("id"));
                    config.setMsisdn(((AirtelRequestToPayDTO) request).getMsisdn());
                }
                default -> {
                    RelworxUser relworxUser = (RelworxUser) apiUser;
                    RelworxRequestToPayDTO r = (RelworxRequestToPayDTO) request;
                    RelworxPaymentRequestDTO req =  new RelworxPaymentRequestDTO(
                            r.getAccount_no(),
                            config.getReference(),
                            r.getAmount(),
                            "UGX",
                            r.getDescription(),
                            r.getMsisdn()
                    );
                    RelworxPaymentResponseDTO response = externalRequests.relworxInitiatePayment(relworxUser, req);
                    config.setInternalReference(response.getInternal_reference());
                    config.setMsisdn(r.getMsisdn());
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return null;
        }
        config.setAmount(BigDecimal.valueOf(request.getAmount()));
        config.setCurrency("UGX");
        config.setProvider(request.getProvider());
        MMTransaction t =  createMMTransaction(config);
        return  t.getId();
    }
    @Override
    public Utils.PROVIDER determineProvider(String msisdn) throws Exception {
        String number = Utils.noPrefixMsisdn(msisdn);
        String prefix  =  number.substring(0, 2);
        if(airtelPrefixes.contains(prefix)){
            return Utils.PROVIDER.AIRTEL;
        } else if (mtnPrefixes.contains(prefix)) {
            return Utils.PROVIDER.MTN;
        }
        throw new Exception("Unsupported provider for tel: "+msisdn);
    }

    @Override
    public boolean isTelecom() {
        return Objects.equals(mmProviderType, "TELECOMS");
    }
}
