package com.turningdrylandsgreen.tdgbackend.controllers;

import com.turningdrylandsgreen.tdgbackend.dto.StkPushRequest;
import com.turningdrylandsgreen.tdgbackend.dto.StkPushResponse;
import com.turningdrylandsgreen.tdgbackend.entities.PaymentTransaction;
import com.turningdrylandsgreen.tdgbackend.repositoryies.PaymentsRepository;
import com.turningdrylandsgreen.tdgbackend.services.BuniPaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/payments")
@RequiredArgsConstructor
public class PaymentController {


    private final BuniPaymentService buniPaymentService;
    private final PaymentsRepository repository;

    @PostMapping("/stk-push")
    public ResponseEntity<StkPushResponse> sendStkPush(@RequestBody StkPushRequest request){

        try{
            return ResponseEntity.ok(buniPaymentService.initiatePayment(request));
        } catch (IllegalAccessException e) {
            throw new RuntimeException("failed to initiate payment");
        }
    }

    @GetMapping("/status/{invoiceNumber}")
    public ResponseEntity<PaymentTransaction> getStatus(@PathVariable String invoiceNumber) {
        return repository.findByInvoiceNumber(invoiceNumber)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
