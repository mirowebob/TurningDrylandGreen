package com.turningdrylandsgreen.tdgbackend.controllers;

import com.turningdrylandsgreen.tdgbackend.dto.IpnCallbackPayload;
import com.turningdrylandsgreen.tdgbackend.entities.PaymentTransaction;
import com.turningdrylandsgreen.tdgbackend.repositoryies.PaymentsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/api/payments/callback")
@RequiredArgsConstructor
public class IpnCallbackController {

    private final PaymentsRepository paymentsRepository;
    private final ObjectMapper objectMapper;

    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, String>> receiveCallback(@RequestBody(required = false) String body, @RequestHeader HttpHeaders headers) {
        IpnCallbackPayload payload = objectMapper.readValue(body, IpnCallbackPayload.class);
        log.error("Received STK Push callback notification");

        log.info("Headers: {}", headers);
        log.info("Raw body: {}", body);
        

        // Log the entire payload for debugging
        log.info("Callback payload: {}", payload);

        try {
            String checkoutRequestId = payload.getCheckoutRequestId();

            if (checkoutRequestId == null) {
                log.error("CheckoutRequestID is null in callback payload");
                return ResponseEntity.badRequest().body(Map.of(
                        "resultCode", "1",
                        "resultDescription", "Invalid callback payload"
                ));
            }

            log.info("Processing callback for CheckoutRequestID: {}", checkoutRequestId);

            paymentsRepository.findByCheckoutRequestId(checkoutRequestId).ifPresentOrElse(txn -> {
                if (payload.isSuccessful()) {
                    txn.setStatus(PaymentTransaction.Status.SUCCESS);
                    txn.setReceiptNumber(payload.getReceiptNumber());
                    log.info("Transaction successful. Receipt: {}", payload.getReceiptNumber());
                } else {
                    txn.setStatus(PaymentTransaction.Status.FAILED);
                    log.warn("Transaction failed. ResultCode: {}, ResultDesc: {}",
                            payload.getResultCode(), payload.getResultDescription());
                }
                txn.setResultDescription(payload.getResultDescription());
                txn.setUpdatedAt(Instant.now());
                paymentsRepository.save(txn);
                log.info("Updated transaction status for CheckoutRequestID: {}", checkoutRequestId);
            }, () -> {
                log.warn("No payment transaction found for CheckoutRequestID: {}", checkoutRequestId);
            });

            // KCB expects this response format
            return ResponseEntity.ok(Map.of(
                    "resultCode", "0",
                    "resultDescription", "success"
            ));

        } catch (Exception e) {
            log.error("Error processing callback notification", e);
            return ResponseEntity.status(500).body(Map.of(
                    "resultCode", "1",
                    "resultDescription", "Error processing callback"
            ));
        }
    }
}