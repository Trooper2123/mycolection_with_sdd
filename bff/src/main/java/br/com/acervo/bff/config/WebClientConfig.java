package br.com.acervo.bff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${core-api.base-url}")
    private String coreApiBaseUrl;

    @Bean
    public WebClient coreApiWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl(coreApiBaseUrl)
                .build();
    }
}
