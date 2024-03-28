package com.oddjobs.services.external;


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
import com.oddjobs.dtos.relworx.response.WebHookResponseData;
import com.oddjobs.entities.mm.airtel.AirtelApiUser;
import com.oddjobs.entities.mm.mtn.MTNApiUser;
import com.oddjobs.dtos.responses.AccessTokenResponseDTO;
import com.oddjobs.entities.mm.relworx.RelworxUser;
import com.oddjobs.entities.transactions.mm.relworx.RelworxTransaction;

public interface ExternalRequests {

    String  sendCreateMomoAPIUser(String primaryKey, String callBack) throws InstantiationException, IllegalAccessException;
    APIkeyResponseDTO generateMomoAPIKey(String userUUID, String primaryKey) throws InstantiationException, IllegalAccessException;
    AccessTokenResponseDTO generateMomoAccessToken(MomoAccessTokenRequestDTO request) throws InstantiationException, IllegalAccessException;
    EmptyResponseDTO momoRequestToPay(MomoRequestToPayDTO request, MTNApiUser user) throws InstantiationException, IllegalAccessException;
    RequestToPayStatusResponseDTO getRequestToPayStatus(String transactionReferenceId, MTNApiUser user) throws InstantiationException, IllegalAccessException;

    AccessTokenResponseDTO generateAirtelAccessToken(AirtelAccessTokenRequestDTO request) throws InstantiationException, IllegalAccessException;

    PaymentResponseDTO airtelInitiatePayment(AirtelApiUser user, AirtelPaymentRequestDTO request) throws InstantiationException, IllegalAccessException;
    PaymentResponseDTO airtelTransactionInquiry(AirtelApiUser user, String transactionId) throws InstantiationException, IllegalAccessException;
    RelworxPaymentResponseDTO relworxInitiatePayment(RelworxUser user, RelworxPaymentRequestDTO request) throws InstantiationException, IllegalAccessException;

    WebHookResponseData relworxCheckTransactionStatus(RelworxUser user, RelworxTransaction transaction) throws IllegalAccessException;
}
