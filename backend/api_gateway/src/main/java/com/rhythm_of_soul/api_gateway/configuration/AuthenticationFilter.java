package com.rhythm_of_soul.api_gateway.configuration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.api_gateway.dto.ApiResponse;
import com.rhythm_of_soul.api_gateway.service.IdentityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.regex.Pattern;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final int UNAUTHENTICATED_CODE = 3999;
    private static final String UNAUTHENTICATED_MESSAGE = "Unauthenticated";

    private final IdentityService identityService;
    private final ObjectMapper objectMapper;

    @Value("${app.api-prefix}")
    private String apiPrefix;

    private final List<Pattern> publicEndpoints = List.of(
            Pattern.compile("^" + apiPrefix + "/identity/auth/.*"),
            Pattern.compile("^" + apiPrefix + "/identity/users/registration")
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        log.info("Processing request: {} {}", request.getMethod(), request.getURI().getPath());

        if (isPublicEndpoint(request)) {
            log.debug("Public endpoint detected, skipping authentication");
            return chain.filter(exchange);
        }

        String token = extractToken(request);
        if (token == null) {
            log.warn("No token provided in request");
            return buildUnauthenticatedResponse(exchange.getResponse());
        }

        log.debug("Verifying token: {}", token);
        return identityService.verify(token)
                .flatMap(response -> {
                    if (response.getData().isValid()) {
                        log.debug("Token is valid, proceeding with request");
                        return chain.filter(exchange);
                    }
                    log.warn("Invalid token detected");
                    return buildUnauthenticatedResponse(exchange.getResponse());
                })
                .onErrorResume(throwable -> {
                    log.error("Error verifying token: {}", throwable.getMessage());
                    return buildUnauthenticatedResponse(exchange.getResponse());
                });
    }

    @Override
    public int getOrder() {
        return -1;
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        return publicEndpoints.stream().anyMatch(pattern -> pattern.matcher(path).matches());
    }

    private String extractToken(ServerHttpRequest request) {
        List<String> authHeaders = request.getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (CollectionUtils.isEmpty(authHeaders)) {
            return null;
        }
        String header = authHeaders.get(0);
        return header.startsWith(BEARER_PREFIX) ? header.substring(BEARER_PREFIX.length()) : null;
    }

    private Mono<Void> buildUnauthenticatedResponse(ServerHttpResponse response) {
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(UNAUTHENTICATED_CODE)
                .message(UNAUTHENTICATED_MESSAGE)
                .build();

        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        try {
            byte[] responseBody = objectMapper.writeValueAsBytes(apiResponse);
            return response.writeWith(Mono.just(response.bufferFactory().wrap(responseBody)));
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize unauthenticated response: {}", e.getMessage());
            return Mono.error(new RuntimeException("Error building response", e));
        }
    }
}