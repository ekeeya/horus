/*
 * Online auctioning system
 *
 * Copyright (c) 2023.  Oddjobs an alias for the author of this software. - www.skycastleauctionhub.com
 *
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@oddjobs.tech <ekeeya@oddjobs.tech>.
 *
 * This program is not free software.
 *
 * NOTICE: All information contained herein is, and remains the property of Oddjobs. - www.oddjobs.tech
 */

package com.oddjobs.entities.mm;

public class Constants {

    public static String MTN_CREATE_USER = "/v1_0/apiuser";
    public static String MTN_GENERATE_API_KEY = "/v1_0/apiuser/{variable}/apikey";
    public static String MTN_GENERATE_COLLECTIONS_ACCESS_TOKEN = "/collection/token/";
    public static String MTN_REQUEST_TO_PAY = "/collection/v1_0/requesttopay";
    public static String MTN_REQUEST_TO_PAY_STATUS = "/collection/v1_0/requesttopay/{variable}";
    public static String MTN_GET_ACC_BALANCE = "/collection/v1_0/account/balance";

    public static String AIRTEL_ACCESS_TOKEN="/auth/oauth2/token";

    public static String AIRTEL_REQUEST_TO_PAY = "/merchant/v1/payments/";

    public static String AIRTEL_REFUND = "/standard/v1/payments/refund";
    public static String AIRTEL_TRANSACTION_STATUS="/standard/v1/payments/{variable}";

    public static String AIRTEL_GET_ACC_BALANCE="/standard/v1/users/balance";

    public  static String RELWORX_ACCEPT_HEADER = "application/vnd.relworx.v2";
    public static String RELWORX_REQUEST_PAYMENT ="/mobile-money/request-payment";

}
