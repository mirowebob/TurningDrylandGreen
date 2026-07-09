package com.turningdrylandsgreen.tdgbackend.services;

import com.turningdrylandsgreen.tdgbackend.config.BuniProperties;
import com.turningdrylandsgreen.tdgbackend.dto.TokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
@RequiredArgsConstructor
public class BuniAuthService {

    private final WebClient webClient;
    private final BuniProperties buniProperties;
    private final ReentrantLock lock = new ReentrantLock();

    private volatile String cachedToken;
    private volatile Instant expiresAt;

    public String getAccessToken() throws IllegalAccessException {

        if (cachedToken != null && Instant.now().isBefore(expiresAt)) {
            return cachedToken;
        }
        lock.lock();
        try {
            if (cachedToken != null &&  Instant.now().isBefore(expiresAt)) {
                return cachedToken;
            }
            return fetchNewToken();
        }finally {
            lock.unlock();
        }
    }

    private String fetchNewToken() throws IllegalAccessException {
        String basicAuth = Base64.getEncoder().encodeToString(
                (buniProperties.getConsumerKey() + ":" + buniProperties.getConsumerSecret()).getBytes(StandardCharsets.UTF_8)
        );

        log.info("Requesting a new buni access token");

        TokenResponse response = webClient.post()
                .uri("/token?grant_type=client_credentials")
                .header(HttpHeaders.AUTHORIZATION, "Basic " +basicAuth)
                .retrieve()
                .bodyToMono(TokenResponse.class)
                .block();

        if(response == null || response.accessToken() == null){
            throw new IllegalAccessException("Failed to obtain a buni access token");
        }

        long epiresInseconds;
        try {
            epiresInseconds = Long.parseLong(response.expiresIn());
        }catch (NumberFormatException  | NullPointerException e){
            epiresInseconds = 3600;
        }
        this.cachedToken = response.accessToken();
        this.expiresAt = Instant.now().plusSeconds(Math.max(epiresInseconds-60, 30));
        return cachedToken;

    }


}
