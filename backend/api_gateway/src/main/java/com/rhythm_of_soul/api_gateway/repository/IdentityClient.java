package com.rhythm_of_soul.api_gateway.repository;

import com.rhythm_of_soul.api_gateway.dto.ApiResponse;
import com.rhythm_of_soul.api_gateway.dto.request.VerifyTokenRequest;
import com.rhythm_of_soul.api_gateway.dto.response.VerifyTokenResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

public interface IdentityClient {
    @PostExchange(url = "/auth/introspect", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ApiResponse<VerifyTokenResponse>> verify(@RequestBody VerifyTokenRequest request);
}
