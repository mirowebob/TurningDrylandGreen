package com.turningdrylandsgreen.tdgbackend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "payment_transactions", indexes = {
        @Index(name = "idx_checkout_request_id", columnList = "checkoutRequestId", unique = true),
        @Index(name = "idx_invoice_number", columnList = "invoiceNumber")
})
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNumber;
    private String checkoutRequestId;
    private String merchantRequestId;
    private String phoneNumber;
    private double amount;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private String receiptNumber;
    private String resultDescription;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public enum Status {
        PENDING, SUCCESS, FAILED
    }

    @PreUpdate
    public void touch() {
        this.updatedAt = Instant.now();
    }
}
