package com.rhythm_of_soul.identity_service.config;

import io.minio.MinioClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "minio")
@Data
public class MinioConfig {
  private String url;
  private String accessKey;
  private String secretKey;
  private String bucket;

  @Bean
  public MinioClient minioClient() {
    return MinioClient.builder()
            .endpoint(url)
            .credentials(accessKey, secretKey)
            .build();
  }
}

