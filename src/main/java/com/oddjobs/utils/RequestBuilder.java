
package com.oddjobs.utils;

import com.oddjobs.dtos.mtn.responses.EmptyResponseDTO;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Builder
@Slf4j
public class RequestBuilder {

    private HttpHeaders headers;
    private HttpMethod method;
    private String url;
    private Object payload;
    private String pathVariable;
    private Object params;
    private ResponseEntity<Object> response;
    private RestTemplate client;

    public static HttpHeaders generateBasicAuthHeader(String username, String password){
        return new HttpHeaders() {{
            String auth = username + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(
                    auth.getBytes(StandardCharsets.US_ASCII) );
            String authHeader = "Basic " + new String( encodedAuth );
            set( "Authorization", authHeader );
        }};
    }
    public <T>  T sendRequest(Class<T> responseClass) throws InstantiationException, IllegalAccessException {
        if(client == null){
            throw new RuntimeException("RestTemplate is null, can't continue");
        }
        if (responseClass == null){
            responseClass = (Class<T>) EmptyResponseDTO.class;
        }
        StringBuilder URL = new StringBuilder(this.pathVariable == null ? this.url : this.url.replace("{variable}", this.pathVariable));
        if (params != null){
            URL.append("?");
            Field[] fields = params.getClass().getDeclaredFields();
            for (Field f: fields){
                URL.append(String.format("%s=%s", f.getName(), f.get(params)));
            }
        }
        log.info(String.valueOf(URL));
        HttpEntity<Object> requestEntity = this.payload == null ? new HttpEntity<>(null, headers) : new HttpEntity<>(this.payload, headers);
        ResponseEntity<Object> responseEntity = client.exchange(String.valueOf(URL),this.method,requestEntity,Object.class);

        Map<String, Object> mappedResponse = new HashMap<>();
        T returnObj =  responseClass.newInstance();
        List<Integer> okStatuses = List.of(new Integer[]{HttpStatus.OK.value(), HttpStatus.CREATED.value(), HttpStatus.ACCEPTED.value()});
        if ( okStatuses.contains(responseEntity.getStatusCode().value())){
            if (responseEntity.getBody() instanceof Map<?, ?> map) {
                if (map.keySet().stream().allMatch(key -> key instanceof String)) {
                    mappedResponse = (Map<String, Object>) map;
                    log.info(mappedResponse.toString());
                    Utils.setProperties(returnObj, mappedResponse);
                    return  returnObj;
                }
            }
            // we shall always parse empty responses
            mappedResponse.put("response", responseEntity.getBody());
            Utils.setProperties(returnObj, mappedResponse);
            return  returnObj;
        }else{
            String message =  String.format("Response Failed with status code %s : %s", responseEntity.getStatusCode().value(), responseEntity.toString());
            log.warn(message);
            return null;
        }

    }

}
