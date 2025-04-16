package com.rhythm_of_soul.identity_service.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.rhythm_of_soul.identity_service.constant.Role;
import com.rhythm_of_soul.identity_service.entity.User;
import com.rhythm_of_soul.identity_service.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_EMAIL= "admin@gmail.com";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin";

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "org.mariadb.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        log.info("Initializing application...");
        return args -> {
            if (userRepository.findByEmail(ADMIN_EMAIL).isEmpty()) {


                User user = User.builder()
                        .firstName("Admin")
                        .lastName("Admin")
                        .email(ADMIN_EMAIL)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .role(Role.ADMIN)
                        .verify_email(true)
                        .build();
                userRepository.save(user);
                log.warn("Admin user and account created with default password '{}'", ADMIN_PASSWORD);
            }

            log.info("Application initialization completed.");
        };
    }
}
