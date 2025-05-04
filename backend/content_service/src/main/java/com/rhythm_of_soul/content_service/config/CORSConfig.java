package com.rhythm_of_soul.content_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CORSConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cấu hình CORS cho toàn bộ ứng dụng
        registry.addMapping("/**")
                .allowedOrigins("*")  // Cho phép tất cả các nguồn
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Các phương thức HTTP
                .allowedHeaders("*")  // Các headers được phép
                .allowCredentials(true)  // Cho phép cookies hoặc thông tin xác thực
                .maxAge(3600);  // Thời gian cache CORS
    }
}

