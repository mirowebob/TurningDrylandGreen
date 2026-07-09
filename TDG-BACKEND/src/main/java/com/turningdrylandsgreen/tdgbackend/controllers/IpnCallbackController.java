package com.turningdrylandsgreen.tdgbackend.controllers;

import com.turningdrylandsgreen.tdgbackend.dto.IpnCallbackPayload;
import com.turningdrylandsgreen.tdgbackend.entities.PaymentTransaction;
import com.turningdrylandsgreen.tdgbackend.repositoryies.PaymentsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static org.springframework.http.ResponseEntity.ok;

@Slf4j
@RestController
@RequestMapping("/api/payments/callback")
@RequiredArgsConstructor
public class IpnCallbackController {

    private final PaymentsRepository paymentsRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<Map<String,String>> receiveCallback(@RequestBody IpnCallbackPayload payload){
        log.info("Receive callback request");

        // i will verify the signature here

        paymentsRepository.findByCheckoutRequestId(payload.checkoutRequestId()).ifPresentOrElse(txn->{
            if (payload.isSuccessful()){
                txn.setStatus(PaymentTransaction.Status.SUCCESS);
                txn.setReceiptNumber(payload.receiptNumber());
            }else {
                txn.setStatus(PaymentTransaction.Status.FAILED);
            }
            txn.setResultDescription(payload.resultDesc());
            paymentsRepository.save(txn);
            log.info("updated transaction");
        }, ()->log.warn("Payment not found"));

        return ResponseEntity.ok(Map.of(
                "resultCode", "0",
                "resultDescription", "success"
        ));
    }
}
