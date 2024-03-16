/*
 * Online auctioning system
 * Copyright (C) 2023 - , Sky Castle Auction Hub ltd. - www.skycastleauctionhub.com
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@skycastleauctionhub.com <ekeeya@skycastleauctionhub.com>
 *
 * This program is not free software
 * NOTICE: All information contained herein is, and remains the property of Sky Castle Auction Hub ltd. - www.skycastleauctionhub.com
 *
 */

package com.oddjobs.services.external;

import com.oddjobs.components.JsonUtils;
import com.oddjobs.dtos.airtel.requests.AirtelAccessTokenRequestDTO;
import com.oddjobs.dtos.airtel.requests.AirtelPaymentRequestDTO;
import com.oddjobs.dtos.airtel.responses.PaymentResponseDTO;
import com.oddjobs.dtos.mtn.requests.MomoAccessTokenRequestDTO;
import com.oddjobs.dtos.mtn.requests.MomoRequestToPayDTO;
import com.oddjobs.dtos.mtn.responses.APIkeyResponseDTO;
import com.oddjobs.dtos.mtn.responses.EmptyResponseDTO;
import com.oddjobs.dtos.mtn.responses.RequestToPayStatusResponseDTO;
import com.oddjobs.dtos.relworx.requests.RelworxPaymentRequestDTO;
import com.oddjobs.dtos.relworx.response.RelworxPaymentResponseDTO;
import com.oddjobs.dtos.requests.GetUserRequestDTO;
import com.oddjobs.entities.mm.*;
import com.oddjobs.entities.mm.airtel.AirtelApiUser;
import com.oddjobs.entities.mm.mtn.MTNApiUser;
import com.oddjobs.entities.mm.relworx.RelworxUser;
import com.oddjobs.utils.RequestBuilder;
import com.oddjobs.dtos.responses.AccessTokenResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalRequestsImpl implements  ExternalRequests{

    private final RestTemplate template;

    @Value("${mtn.baseUrl}")
    private String MTN_BASE_URL;

    @Value("${airtel.baseUrl}")
    private String AIRTEL_BASE_URL;

    @Value("${application.relworx.baseUrl}")
    private String RELWORX_BASE_URL;


    private final JsonUtils jsonUtils;
    protected <T extends APIUser> HttpHeaders setAuthHeader(T user, HttpHeaders headers) {
        String bearerToken = String.format("Bearer %s", user.getAccessToken());
        headers.set("Authorization", bearerToken);
        return headers;
    }
    @Override
    public String sendCreateMomoAPIUser(String primaryKey, String callBack) throws InstantiationException, IllegalAccessException {
        String referenceId = UUID.randomUUID().toString();
        String url = MTN_BASE_URL+ Constants.MTN_CREATE_USER;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Ocp-Apim-Subscription-Key", primaryKey);
        headers.set("X-Reference-Id", referenceId);
        GetUserRequestDTO payload = new GetUserRequestDTO();
        payload.setProviderCallbackHost(callBack);
        RequestBuilder request =  RequestBuilder.builder()
                .headers(headers)
                .url(url)
                .method(HttpMethod.POST)
                .client(template)
                .payload(payload)
                .build();
        EmptyResponseDTO response =  request.sendRequest(null);
        log.info(response.toString());
        return referenceId;
    }

    @Override
    public APIkeyResponseDTO generateMomoAPIKey(String userUUID, String primaryKey) throws InstantiationException, IllegalAccessException {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Ocp-Apim-Subscription-Key", primaryKey);
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.add(HttpHeaders.CONTENT_LENGTH,"0");
        String url = MTN_BASE_URL+Constants.MTN_GENERATE_API_KEY;
        RequestBuilder request =  RequestBuilder.builder()
                .headers(headers)
                .url(url)
                .pathVariable(userUUID)
                .method(HttpMethod.POST)
                .client(template)
                .build();
        APIkeyResponseDTO response = request.sendRequest(APIkeyResponseDTO.class);
        log.info(response.toString());
        return response;
    }

    @Override
    public AccessTokenResponseDTO generateMomoAccessToken(MomoAccessTokenRequestDTO request) throws InstantiationException, IllegalAccessException {
        String URL = MTN_BASE_URL+Constants.MTN_GENERATE_COLLECTIONS_ACCESS_TOKEN;
        HttpHeaders headers =  RequestBuilder.generateBasicAuthHeader(request.getUserUuid(), request.getApiKey());
        headers.set("Ocp-Apim-Subscription-Key", request.getPrimaryKey());
        RequestBuilder requestBuilder =  RequestBuilder.builder()
                .url(URL)
                .client(template)
                .headers(headers)
                .method(HttpMethod.POST)
                .build();
        AccessTokenResponseDTO response = requestBuilder.sendRequest(AccessTokenResponseDTO.class);
        log.info(response.toString());
        return response;
    }

    @Override
    public EmptyResponseDTO momoRequestToPay(MomoRequestToPayDTO request, MTNApiUser user) throws InstantiationException, IllegalAccessException {
        String URL = MTN_BASE_URL+Constants.MTN_REQUEST_TO_PAY;
        String referenceId = UUID.randomUUID().toString();
        HttpHeaders headers = new HttpHeaders();
        String bearerToken = String.format("Bearer %s", user.getAccessToken());
        headers.add(HttpHeaders.AUTHORIZATION, bearerToken);
        headers.set("Ocp-Apim-Subscription-Key",user.getPrimaryKey());
        headers.set("X-Target-Environment", user.getEnvironment().toString().toLowerCase());
        headers.set("X-Reference-Id", referenceId);
        RequestBuilder requestBuilder = RequestBuilder.builder()
                .url(URL)
                .headers(headers)
                .method(HttpMethod.POST)
                .client(template)
                .payload(request)
                .build();
        EmptyResponseDTO response = requestBuilder.sendRequest(EmptyResponseDTO.class);
        response.setXReferenceId(referenceId);
        log.info(response.toString());
        return  response;
    }

    @Override
    public RequestToPayStatusResponseDTO getRequestToPayStatus(String transactionReferenceId, MTNApiUser user) throws InstantiationException, IllegalAccessException {
        String URL =  MTN_BASE_URL+ Constants.MTN_REQUEST_TO_PAY_STATUS;
        HttpHeaders headers = new HttpHeaders();
        String bearerToken = String.format("Bearer %s", user.getAccessToken());
        headers.add(HttpHeaders.AUTHORIZATION, bearerToken);
        headers.set("Ocp-Apim-Subscription-Key",user.getPrimaryKey());
        headers.set("X-Target-Environment", user.getEnvironment().toString().toLowerCase());
        RequestBuilder request =  RequestBuilder.builder()
                .url(URL)
                .headers(headers)
                .method(HttpMethod.GET)
                .pathVariable(transactionReferenceId)
                .client(template)
                .build();
        RequestToPayStatusResponseDTO response =  request.sendRequest(RequestToPayStatusResponseDTO.class);
        log.info(response.toString());
        return response;
    }

    @Override
    public AccessTokenResponseDTO generateAirtelAccessToken(AirtelAccessTokenRequestDTO payload) throws InstantiationException, IllegalAccessException {

        String URL = AIRTEL_BASE_URL+Constants.AIRTEL_ACCESS_TOKEN;
        HttpHeaders headers =  new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.add(HttpHeaders.ACCEPT, MediaType.ALL_VALUE);
        RequestBuilder request= RequestBuilder.builder()
                .url(URL)
                .method(HttpMethod.POST)
                .client(template)
                .payload(payload)
                .build();

        AccessTokenResponseDTO response =  request.sendRequest(AccessTokenResponseDTO.class);
        log.info(""+response);
        return response;
    }

    @Override
    public PaymentResponseDTO airtelInitiatePayment(AirtelApiUser user, AirtelPaymentRequestDTO request) throws InstantiationException, IllegalAccessException {
        String URL = AIRTEL_BASE_URL+Constants.AIRTEL_REQUEST_TO_PAY;
        String bearerToken = String.format("Bearer %s", user.getAccessToken());
        HttpHeaders headers =  new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.add(HttpHeaders.ACCEPT, MediaType.ALL_VALUE);
        headers.set("X-Country", "UG");
        headers.set("X-Currency", "UGX");
        headers.set("Authorization",bearerToken);
        RequestBuilder requestBuilder = RequestBuilder.builder()
                .url(URL)
                .headers(headers)
                .method(HttpMethod.POST)
                .client(template)
                .payload(request)
                .build();
        PaymentResponseDTO response = requestBuilder.sendRequest(PaymentResponseDTO.class);
        log.info(""+ response);
        return response;
    }
    @Override
    public PaymentResponseDTO airtelTransactionInquiry(AirtelApiUser user, String transactionId) throws InstantiationException, IllegalAccessException {
        String URL = AIRTEL_BASE_URL+Constants.AIRTEL_TRANSACTION_STATUS;
        HttpHeaders headers =  new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.add(HttpHeaders.ACCEPT, MediaType.ALL_VALUE);
        headers.set("X-Country", "UG");
        headers.set("X-Currency", "UGX");
        headers =  setAuthHeader(user, headers);
        RequestBuilder request = RequestBuilder.builder()
                .url(URL)
                .client(template)
                .method(HttpMethod.GET)
                .pathVariable(transactionId)
                .headers(headers)
                .build();
        PaymentResponseDTO response = request.sendRequest(PaymentResponseDTO.class);
        log.info(""+response);
        return response;
    }



    @Override
    public RelworxPaymentResponseDTO relworxInitiatePayment(RelworxUser user, RelworxPaymentRequestDTO request) throws InstantiationException, IllegalAccessException {
        HttpHeaders headers =  new HttpHeaders();
        headers =  setAuthHeader(user, headers);
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.add(HttpHeaders.ACCEPT, Constants.RELWORX_ACCEPT_HEADER);
        String URL = RELWORX_BASE_URL+Constants.RELWORX_REQUEST_PAYMENT;
        RequestBuilder externalRequest = RequestBuilder.builder()
                .url(URL)
                .client(template)
                .method(HttpMethod.POST)
                .headers(headers)
                .build();
        log.info("Preparing to make external call to url {} using payload: {}", URL, jsonUtils.convertToJson(request));
        RelworxPaymentResponseDTO response = externalRequest.sendRequest(RelworxPaymentResponseDTO.class);
        log.info("Received response from RELWORX: "+response);
        return response;
    }
}
