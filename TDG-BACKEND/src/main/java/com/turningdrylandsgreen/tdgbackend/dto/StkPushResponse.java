package com.turningdrylandsgreen.tdgbackend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record StkPushResponse(
        @JsonProperty("response") ResponseBody response,
        @JsonProperty("header") Header header
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ResponseBody(
            @JsonProperty("MerchantRequestID") String merchantRequestId,
            @JsonProperty("CheckoutRequestID") String checkoutRequestId,
            @JsonProperty("ResponseCode") String responseCode,
            @JsonProperty("ResponseDescription") String responseDescription,
            @JsonProperty("CustomerMessage") String customerMessage
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Header(
            @JsonProperty("statusCode") String statusCode,
            @JsonProperty("statusDescription") String statusDescription
    ) {
    }
}
