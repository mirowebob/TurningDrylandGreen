package com.turningdrylandsgreen.tdgbackend.services;

import com.turningdrylandsgreen.tdgbackend.config.BuniProperties;
import com.turningdrylandsgreen.tdgbackend.dto.BuniStkPushPayload;
import com.turningdrylandsgreen.tdgbackend.dto.StkPushRequest;
import com.turningdrylandsgreen.tdgbackend.dto.StkPushResponse;
import com.turningdrylandsgreen.tdgbackend.entities.PaymentTransaction;
import com.turningdrylandsgreen.tdgbackend.repositoryies.PaymentsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.time.Instant;

@Service
@Slf4j
@RequiredArgsConstructor
public class BuniPaymentService {
    private final WebClient webClient;
    private final BuniAuthService authService;
    private final BuniProperties props;
    private final PaymentsRepository paymentsRepository;

    public StkPushResponse initiatePayment(StkPushRequest request) throws IllegalAccessException {
        String token = authService.getAccessToken();

        BuniStkPushPayload payload = new BuniStkPushPayload(
                request.phoneNumber(),
                String.valueOf(request.amount()),
                request.invoiceNumber(),
                props.isSharedShortCode(),
                props.getOrgShortCode(),
                props.getOrgPassKey(),
                props.getCallbackUrl(),
                request.description() != null ? request.description() : "Payment"
        );

        StkPushResponse response = webClient.post()
                .uri("/mm/api/request/1.0.0/stkpush")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(StkPushResponse.class)
                .retryWhen(Retry.backoff(2, Duration.ofMillis(500))
                        .filter(ex ->ex instanceof WebClientRequestException))
                .block();

        assert response != null;
        log.info("StkPushResponse {}", response.response());

        if (response != null && response != null) {
            PaymentTransaction txn = PaymentTransaction.builder()
                    .invoiceNumber(request.invoiceNumber())
                    .createdAt(Instant.now())
                    .checkoutRequestId(response.response().checkoutRequestId())
                    .merchantRequestId(response.response().merchantRequestId())
                    .phoneNumber(request.phoneNumber())
                    .amount(request.amount())
                    .status(PaymentTransaction.Status.PENDING)
                    .build();

            paymentsRepository.save(txn);
        }else
            log.error("Payment request response is null");
        return response;
    }

}
