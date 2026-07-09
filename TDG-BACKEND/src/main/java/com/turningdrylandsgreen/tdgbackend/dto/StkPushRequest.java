package com.turningdrylandsgreen.tdgbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

/**
 * Inbound request from your own frontend/backend to trigger a payment prompt.
 * Keep this separate from the payload actually sent to Buni (BuniStkPushPayload).
 */
public record StkPushRequest(
        @NotBlank
        @Pattern(regexp = "^254[17]\\d{8}$", message = "phone must be in format 2547XXXXXXXX or 2541XXXXXXXX")
        String phoneNumber,

        @Positive
        double amount,

        @NotBlank
        String invoiceNumber,   // your internal order/invoice reference

        String description      // shown to the customer, e.g. "Order #1234"
) {
}
