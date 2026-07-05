package com.turningdrylandsgreen.tdgbackend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Configurations {
    private String cloudName;
    private String apiKey;
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary(){
        return new Cloudinary(
                ObjectUtils.asMap(
                        "cloud_name", cloudName,
                        "api-key",apiKey,
                        "api-secret",apiSecret,
                        "secure",true
                )
        );
    }


}
