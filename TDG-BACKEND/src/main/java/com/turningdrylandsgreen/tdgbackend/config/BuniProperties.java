package com.turningdrylandsgreen.tdgbackend.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "kcb.buni")
@Data
public class BuniProperties {
    private String baseUrl;
    private String consumerKey;
    private String consumerSecret;
    private String orgShortCode;
    private String orgPassKey;
    private boolean sharedShortCode;
    private String callbackUrl;
    private String ipnSignatureKey;
}
