package com.rhythm_of_soul.notification_service.config;

import com.rhythm_of_soul.notification_service.util.AESUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
public class AESConfig {

  @Value("${aes.secret-key}")
  private String base64SecretKey;

  @Bean
  public SecretKey secretKey() {
    return AESUtil.decodeKeyFromBase64(base64SecretKey);
  }
}
