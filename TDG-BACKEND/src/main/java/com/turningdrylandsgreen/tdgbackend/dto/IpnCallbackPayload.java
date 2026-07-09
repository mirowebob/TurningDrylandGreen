package com.turningdrylandsgreen.tdgbackend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Shape of the payload KCB Buni posts to your registered callback URL, both for
 * STK Push results and general IPN (Instant Payment Notification) account-credit events.
 * Field names can vary slightly by product (STK vs generic IPN) — confirm exact
 * field names against the payload sample in your Buni dev portal sandbox app,
 * and adjust @JsonProperty mappings here if needed. Unknown fields are ignored
 * so a mismatch won't break deserialization.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record IpnCallbackPayload(
        @JsonProperty("MerchantRequestID") String merchantRequestId,
        @JsonProperty("CheckoutRequestID") String checkoutRequestId,
        @JsonProperty("ResultCode") String resultCode,
        @JsonProperty("ResultDesc") String resultDesc,
        @JsonProperty("Amount") String amount,
        @JsonProperty("MpesaReceiptNumber") String receiptNumber,
        @JsonProperty("TransactionDate") String transactionDate,
        @JsonProperty("PhoneNumber") String phoneNumber,
        @JsonProperty("InvoiceNumber") String invoiceNumber,
        @JsonProperty("signature") String signature
) {
    public boolean isSuccessful() {
        return "0".equals(resultCode);
    }
}
