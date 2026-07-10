package com.turningdrylandsgreen.tdgbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient buniWebClient(BuniProperties props) {
        ConnectionProvider provider = ConnectionProvider.builder("buni-pool")

                .maxIdleTime(Duration.ofSeconds(10))
                .maxLifeTime(Duration.ofSeconds(30))
                .pendingAcquireTimeout(Duration.ofSeconds(10))
                .evictInBackground(Duration.ofSeconds(15)).build();

        HttpClient httpClient = HttpClient.create(provider).responseTimeout(Duration.ofSeconds(15));
        return WebClient.builder()
                .baseUrl(props.getBaseUrl())
                .build();
    }
}
