package com.turningdrylandsgreen.tdgbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BuniStkPushPayload(
        @JsonProperty("phoneNumber") String phoneNumber,
        @JsonProperty("amount") String amount,
        @JsonProperty("invoiceNumber") String invoiceNumber,
        @JsonProperty("sharedShortCode") boolean sharedShortCode,
        @JsonProperty("orgShortCode") String orgShortCode,
        @JsonProperty("orgPassKey") String orgPassKey,
        @JsonProperty("callbackUrl") String callbackUrl,
        @JsonProperty("transactionDescription") String transactionDescription
) {
}
