package com.oddjobs.services.external;


import com.oddjobs.dtos.airtel.requests.AirtelAccessTokenRequestDTO;
import com.oddjobs.dtos.airtel.requests.AirtelPaymentRequestDTO;
import com.oddjobs.dtos.airtel.responses.PaymentResponseDTO;
import com.oddjobs.dtos.easypay.requests.EasyPaymentRequestDTO;
import com.oddjobs.dtos.easypay.response.EasyPayResponseDTO;
import com.oddjobs.dtos.easypay.response.EasypayStatusResponse;
import com.oddjobs.dtos.flutterwave.requests.FlutterwavePaymentRequestDTO;
import com.oddjobs.dtos.flutterwave.response.FlutterwaveResponseDTO;
import com.oddjobs.dtos.flutterwave.response.FlutterwaveStatusResponse;
import com.oddjobs.dtos.mtn.requests.MomoAccessTokenRequestDTO;
import com.oddjobs.dtos.mtn.requests.MomoRequestToPayDTO;
import com.oddjobs.dtos.mtn.responses.APIkeyResponseDTO;
import com.oddjobs.dtos.mtn.responses.EmptyResponseDTO;
import com.oddjobs.dtos.mtn.responses.RequestToPayStatusResponseDTO;
import com.oddjobs.entities.mm.AirtelApiUser;
import com.oddjobs.entities.mm.EasyPayApiUser;
import com.oddjobs.entities.mm.FlutterWaveApiUser;
import com.oddjobs.entities.mm.MTNApiUser;
import com.oddjobs.dtos.responses.AccessTokenResponseDTO;

public interface ExternalRequests {

    String  sendCreateMomoAPIUser(String primaryKey, String callBack) throws InstantiationException, IllegalAccessException;
    APIkeyResponseDTO generateMomoAPIKey(String userUUID, String primaryKey) throws InstantiationException, IllegalAccessException;
    AccessTokenResponseDTO generateMomoAccessToken(MomoAccessTokenRequestDTO request) throws InstantiationException, IllegalAccessException;
    EmptyResponseDTO momoRequestToPay(MomoRequestToPayDTO request, MTNApiUser user) throws InstantiationException, IllegalAccessException;
    RequestToPayStatusResponseDTO getRequestToPayStatus(String transactionReferenceId, MTNApiUser user) throws InstantiationException, IllegalAccessException;

    AccessTokenResponseDTO generateAirtelAccessToken(AirtelAccessTokenRequestDTO request) throws InstantiationException, IllegalAccessException;

    PaymentResponseDTO airtelInitiatePayment(AirtelApiUser user, AirtelPaymentRequestDTO request) throws InstantiationException, IllegalAccessException;
    PaymentResponseDTO airtelTransactionInquiry(AirtelApiUser user, String transactionId) throws InstantiationException, IllegalAccessException;

    EasyPayResponseDTO easyInitiatePayment(EasyPayApiUser user, EasyPaymentRequestDTO request) throws InstantiationException, IllegalAccessException;

    EasypayStatusResponse easyTransactionStatus(EasyPayApiUser user, String  reference) throws InstantiationException, IllegalAccessException;
    FlutterwaveResponseDTO flutterWaveInitiatePayment(FlutterWaveApiUser user, FlutterwavePaymentRequestDTO payload) throws InstantiationException, IllegalAccessException;
    FlutterwaveStatusResponse flutterWaveTransactionInquiry(FlutterWaveApiUser user, String reference) throws InstantiationException, IllegalAccessException;
}
