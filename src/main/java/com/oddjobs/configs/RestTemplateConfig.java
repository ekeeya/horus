package com.oddjobs.configs;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class RestTemplateConfig {


    @Value("${mm.api.connectionTimeout}")
    private int connectionTimeout;

    @Value("${mm.api.readTimeout}")
    private int readTimeout;

    @Bean
    public RestTemplateBuilder restTemplateBuilder() {
        return new RestTemplateBuilder();
    }


    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        try (PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager()) {
            connectionManager.setDefaultMaxPerRoute(100);
            connectionManager.setMaxTotal(200);

            BufferingClientHttpRequestFactory requestFactory = new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory());
            return builder.requestFactory(() -> requestFactory)
                    .setConnectTimeout(Duration.ofMillis(connectionTimeout))
                    .setReadTimeout(Duration.ofMillis(readTimeout))
                    .interceptors(new LoggingInterceptor()).build();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return null;
        }
    }
}
