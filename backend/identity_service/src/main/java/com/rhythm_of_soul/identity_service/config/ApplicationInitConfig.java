package com.rhythm_of_soul.identity_service.config;

import com.rhythm_of_soul.identity_service.constant.Role;
import com.rhythm_of_soul.identity_service.constant.SecurityConstants;
import com.rhythm_of_soul.identity_service.entity.Account;
import com.rhythm_of_soul.identity_service.repository.AccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
public class ApplicationInitConfig {

    private final PasswordEncoder passwordEncoder;
    
    ApplicationInitConfig(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "org.mariadb.jdbc.Driver")
    ApplicationRunner applicationRunner(AccountRepository accountRepository) {
        log.info("Initializing application...");
        return args -> {
            if (accountRepository.findByEmail(SecurityConstants.ADMIN_EMAIL).isEmpty()) {


                Account accountAdmin = Account.builder()
                        .email(SecurityConstants.ADMIN_EMAIL)
                        .password(passwordEncoder.encode(SecurityConstants.ADMIN_PASSWORD))
                        .role(Role.ADMIN)
                        .isVerified(true)
                        .build();
                accountRepository.save(accountAdmin);
                log.warn("Admin user and account created with default password '{}'", SecurityConstants.ADMIN_PASSWORD);
            }

            log.info("Application initialization completed.");
        };
    }
}
