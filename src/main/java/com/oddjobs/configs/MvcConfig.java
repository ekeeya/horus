package com.oddjobs.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnExpression("${app.api.logging.enable:true}")
public class MvcConfig {
    @Value("${app.api.logging.url-patterns:*}")
    private String[] urlPatterns;

    @Value("${app.api.logging.requestIdParamName:requestId}")
    private String requestIdParamName;
    @Bean
    public FilterRegistrationBean<ApiRequestResponseLogger> loggingFilter() {
        FilterRegistrationBean<ApiRequestResponseLogger> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new ApiRequestResponseLogger(requestIdParamName));
        registrationBean.addUrlPatterns(urlPatterns);
        return registrationBean;
    }
}
