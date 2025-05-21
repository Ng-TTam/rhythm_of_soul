package com.rhythm_of_soul.identity_service.config;

import java.util.List;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.rhythm_of_soul.identity_service.config.jwt.JwtAuthenticationEntryPoint;
import com.rhythm_of_soul.identity_service.repository.AccountRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
        "/users",
        "/auth/login",
        "/auth/logout",
        "/auth/refresh",
        "/reset-password/request",
        "/reset-password/verify",
        "/auth/login",
        "/auth/introspect",
        "/auth/logout",
        "/auth/refresh",
        "/api/auth/**",
        "/auth/log",
        "/api/sign-up",
        "/lib/**",
        "/users/information/**",
    };

    @Value("${jwt.signerKey}")
    private String signerKey;

    private final AccountRepository accountRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request -> request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS)
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/users/information/**")
                        .permitAll()
                        .requestMatchers("/sign-in", "/sign-up", "/css/**", "/images/**", "/auth/introspect")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                //                .formLogin(form -> form.loginPage("/sign-in")
                //                        .loginProcessingUrl("/sign-in")
                //                        .successHandler((request, response, authentication) -> {
                //                            // Chuyển hướng sau khi đăng nhập thành công
                //                            response.sendRedirect("/home");
                //                        })
                //                        .failureHandler((request, response, exception) -> {
                //                            RedirectAttributes redirectAttributes = new RedirectAttributesModelMap();
                //                            redirectAttributes.addFlashAttribute("error", "Email hoặc mật khẩu không
                // đúng");
                //                            response.sendRedirect(request.getContextPath() + "/sign-in");
                //                        })
                //                        .permitAll())
                .rememberMe(remember -> remember.rememberMeParameter("remember")
                        .tokenValiditySeconds(30 * 24 * 60 * 60) // 30 days
                        .rememberMeServices(tokenBasedRememberMeServices()))
        //                .logout(logout -> logout.permitAll().logoutSuccessUrl("/login?logout=true"))
        ;

        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer ->
                        jwtConfigurer.decoder(jwtDecode()).jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()));

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Nguồn gốc được phép
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    public JwtDecoder jwtDecode() throws JwtException {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> accountRepository
                .findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public TokenBasedRememberMeServices tokenBasedRememberMeServices() {
        TokenBasedRememberMeServices services = new TokenBasedRememberMeServices(signerKey, userDetailsService());
        services.setTokenValiditySeconds(30 * 24 * 60 * 60);
        services.setParameter("remember");
        return services;
    }
}
