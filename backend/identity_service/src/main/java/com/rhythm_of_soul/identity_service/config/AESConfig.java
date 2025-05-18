package com.rhythm_of_soul.identity_service.config;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.rhythm_of_soul.identity_service.utils.AESUtil;

@Configuration
public class AESConfig {

    @Value("${aes.secret-key}")
    private String base64SecretKey;

    @Bean
    public SecretKey secretKey() {
        return AESUtil.decodeKeyFromBase64(base64SecretKey);
    }
}
