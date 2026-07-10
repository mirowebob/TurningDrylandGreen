package com.turningdrylandsgreen.tdgbackend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Shape of the payload KCB Buni posts to your registered callback URL for STK Push results.
 * Based on KCB MPESA STK Push API Specification Document Version 1.0
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record IpnCallbackPayload(
        @JsonProperty("Body") Body body
) {
    public boolean isSuccessful() {
        return body != null && body.stkCallback() != null &&
                body.stkCallback().resultCode()==0;
    }

    public String getCheckoutRequestId() {
        return body != null && body.stkCallback() != null ?
                body.stkCallback().checkoutRequestId() : null;
    }

    public String getMerchantRequestId() {
        return body != null && body.stkCallback() != null ?
                body.stkCallback().merchantRequestId() : null;
    }

    public Integer getResultCode() {
        return body != null && body.stkCallback() != null ?
                body.stkCallback().resultCode() : null;
    }

    public String getResultDescription() {
        return body != null && body.stkCallback() != null ?
                body.stkCallback().resultDesc() : null;
    }

    public String getAmount() {
        return body != null && body.stkCallback() != null &&
                body.stkCallback().callbackMetadata() != null ?
                body.stkCallback().callbackMetadata().getAmount() : null;
    }

    public String getReceiptNumber() {
        return body != null && body.stkCallback() != null &&
                body.stkCallback().callbackMetadata() != null ?
                body.stkCallback().callbackMetadata().getReceiptNumber() : null;
    }

    public String getTransactionDate() {
        return body != null && body.stkCallback() != null &&
                body.stkCallback().callbackMetadata() != null ?
                body.stkCallback().callbackMetadata().getTransactionDate() : null;
    }

    public String getPhoneNumber() {
        return body != null && body.stkCallback() != null &&
                body.stkCallback().callbackMetadata() != null ?
                body.stkCallback().callbackMetadata().getPhoneNumber() : null;
    }

    public record Body(
            @JsonProperty("stkCallback") StkCallback stkCallback
    ) {}

    public record StkCallback(
            @JsonProperty("MerchantRequestID") String merchantRequestId,
            @JsonProperty("CheckoutRequestID") String checkoutRequestId,
            @JsonProperty("ResultCode") int resultCode,
            @JsonProperty("ResultDesc") String resultDesc,
            @JsonProperty("CallbackMetadata") CallbackMetadata callbackMetadata
    ) {}

    public record CallbackMetadata(
            @JsonProperty("Item") List<Item> items
    ) {
        public String getAmount() {
            return getValueByName("Amount");
        }

        public String getReceiptNumber() {
            return getValueByName("MpesaReceiptNumber");
        }

        public String getTransactionDate() {
            return getValueByName("TransactionDate");
        }

        public String getPhoneNumber() {
            return getValueByName("PhoneNumber");
        }

        private String getValueByName(String name) {
            if (items == null) return null;
            return items.stream()
                    .filter(item -> name.equals(item.name()))
                    .findFirst()
                    .map(Item::value)
                    .orElse(null).toString();
        }
    }

    public record Item(
            @JsonProperty("Name") String name,
            @JsonProperty("Value") Object value
    ) {
        public Object value() {
            return value != null ? value.toString() : null;
        }
    }
}